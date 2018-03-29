import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from "@ngrx/store";
import { AngularFireAuth } from "angularfire2/auth";
import { User as FirebaseUser } from "firebase/app";
import { Observable } from 'rxjs/Observable';
import {
  catchError, map, switchMap, filter, tap,
  withLatestFrom } from 'rxjs/operators';

import {
  DeviceActionTypes,
  DevicesLoaded,
  ConfigureDevices,
  ConfigureDeviceRequest,
  LoadDevicesById,
  EnsureDevicesAreLoaded,
  SelectDevice } from "./device.actions";
import {
  State,
  getDeviceDictionary,
  DeviceDictionary } from "./device-feature.reducer";
import { Device } from "./device";

interface UrlQueryList {
  [key: string]: string | string[];
}

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
          switchMap(() => this.getUserAccessibleDevices()),
          tap(console.log),
          map(devices => new DevicesLoaded({devices}))
      );

  @Effect({ dispatch: false })
  configureDevices$ =
      this.actions$.pipe(
          ofType(DeviceActionTypes.CONFIGURE_DEVICES),
          switchMap((action: ConfigureDevices) =>
              this.putDeviceConfigs(action.payload))
      );

  @Effect()
  loadDevicesById$ =
      this.actions$.pipe(
          ofType(DeviceActionTypes.LOAD_DEVICES_BY_ID),
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

  private getDevices(params: UrlQueryList): Observable<Device[]> {
    return this.getIdToken().pipe(
        switchMap(idToken => this.http.get<Device[]>(
          "api/devices", {
            params: params,
            headers: new HttpHeaders({
              "Authorization": idToken
            })
          }
        )))
  }

  private getDevicesById(deviceIds: string[]): Observable<Device[]> {
    return this.getDevices({
      "deviceIds": deviceIds
    });
  }

  private getUserAccessibleDevices(): Observable<Device[]> {
    return this.getDevices({
      "allUserDevices": "true"
    });
  }

  private putDeviceConfigs(body: ConfigureDeviceRequest[]) {
    return this.getIdToken().pipe(
      switchMap(idToken => this.http.put<any>(
          "api/devices",
          body,
          {
            headers: new HttpHeaders({
              "Authorization": idToken
            })
          }
      ))
    );
  }
}
