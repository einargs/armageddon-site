import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from "@ngrx/store";
import { AngularFireAuth } from "angularfire2/auth";
import { User as FirebaseUser } from "firebase/app";
import { Observable } from 'rxjs/Observable';
import {
  catchError, map, switchMap, filter,
  withLatestFrom } from 'rxjs/operators';

import {
  DeviceActionTypes,
  DevicesLoaded,
  ChangeDeviceConfig,
  LoadDevicesById,
  EnsureDevicesAreLoaded,
  SelectDevice } from "./device.actions";
import {
  State,
  getDeviceDictionary,
  DeviceDictionary } from "./device-feature.reducer";
import { Device } from "./device";

//TODO Reformat the observable pipes. I've got this bastard implementation
// of the google javascript style guide's advice on multi-line arguments
// that probably needs to be re-thought.
@Injectable()
export class DeviceEffects {
  // The forcible cast is required because the default id type is
  // `string[] | number[]`.
  loadedDevices: Observable<DeviceDictionary> =
      this.store.pipe(select(getDeviceDictionary));

  @Effect()
  loadAccessibleDevices$ =
      this.actions$.pipe(
          ofType(DeviceActionTypes.LOAD_ACCESSIBLE_DEVICES),
          switchMap(() => this.getIdToken()),
          switchMap(idToken => this.http.get<Device[]>("api/devices/list", {
            headers: new HttpHeaders({
              "Authorization": idToken
            })
          })),
          map(devices => new DevicesLoaded({devices}))
      );

  @Effect({ dispatch: false })
  configureDevice$ =
      this.actions$.pipe(
          ofType(DeviceActionTypes.CHANGE_DEVICE_CONFIG),
          map((action: ChangeDeviceConfig) => action.payload),
          switchMap(payload => this.putDeviceConfig(
              payload.deviceId, payload.newConfig))
      );

  @Effect()
  loadDevicesById$ =
      this.actions$.pipe(
          ofType(DeviceActionTypes.LOAD_DEVICE_BY_ID),
          switchMap((action: LoadDevicesById) =>
              this.getDevicesById(action.payload.deviceIds)),
          map((devices: Device[]) =>
              new DevicesLoaded({devices}))
      );

  @Effect()
  ensureDevicesAreLoaded$ =
      this.actions$.pipe(
          ofType(DeviceActionTypes.ENSURE_DEVICES_ARE_LOADED),
          map((action: EnsureDevicesAreLoaded) => action.payload.deviceIds),
          withLatestFrom(this.loadedDevices),
          map(([ensureIds, loadedDevices]: [string[], DeviceDictionary]) =>
              ensureIds.filter(id => !loadedDevices[id])),
          filter((deviceIds: string[]) => deviceIds.length > 0),
          map((deviceIds: string[]) => new LoadDevicesById({deviceIds}))
      );

  @Effect()
  ensureSelectedDevicesAreLoaded$ =
      this.actions$.pipe(
          ofType(DeviceActionTypes.SELECT_DEVICE),
          map((action: SelectDevice) => action.payload.deviceId),
          map((deviceId: string) =>
              new EnsureDevicesAreLoaded({deviceIds: [deviceId]}))
      );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private store: Store<State>
  ) {}

  private getIdToken(): Observable<string> {
    return this.afAuth.authState.pipe(
        filter(firebaseUser => firebaseUser !== null),
        switchMap(user => Observable.fromPromise(user.getIdToken())));
  }

  private getDevicesById(deviceIds: string[]): Observable<Device[]> {
    return this.getIdToken().pipe(
      switchMap(idToken => this.http.get<Device[]>(
          "api/devices/get", {
            params: {
              deviceIds: deviceIds
            },
            headers: new HttpHeaders({
              "Authorization": idToken
            })
          }
        )));
  }

  private putDeviceConfig(deviceId: string, newConfig: any) {
    return this.afAuth.authState.pipe(
      switchMap(() => this.getIdToken()),
      switchMap(idToken => this.http.put<any>(
          "api/devices/configure",
          {
            deviceId: deviceId,
            config: newConfig
          },
          {
            headers: new HttpHeaders({
              "Authorization": idToken
            })
          }
      ))
    );
  }
}
