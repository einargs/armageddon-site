import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from "angularfire2/auth";
import { User as FirebaseUser } from "firebase/app";
import { Observable } from 'rxjs/Observable';
import { catchError, map, switchMap, filter } from 'rxjs/operators';

import {
  DeviceActionTypes,
  DevicesLoaded,
  ChangeDeviceConfig } from "./device.actions";
import { Device } from "./device";

@Injectable()
export class DeviceEffects {
  @Effect()
  loadAccessibleDevices$ =
      this.actions$.pipe(
          ofType(DeviceActionTypes.LOAD_ACCESSIBLE_DEVICES),
          switchMap(action => this.afAuth.authState),
          filter(firebaseUser => firebaseUser !== null),
          switchMap(user => Observable.fromPromise(user.getIdToken())),
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

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private afAuth: AngularFireAuth
  ) {}

  private putDeviceConfig(deviceId: string, newConfig: any) {
    return this.afAuth.authState.pipe(
      filter(firebaseUser => firebaseUser !== null),
      switchMap(user => Observable.fromPromise(user.getIdToken())),
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
