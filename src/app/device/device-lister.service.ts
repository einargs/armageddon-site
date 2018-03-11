import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { switchMap, filter, map } from "rxjs/operators";
import { AngularFireAuth } from "angularfire2/auth";
import { Store, select } from "@ngrx/store";

import { CoreState } from "../core/core.reducer";
import { User } from "../auth/auth.actions";
import { getUser } from "../auth/auth.reducer";
import { Device} from "./device";

@Injectable()
export class DeviceListerService {
  user$: Observable<User> = this.store.pipe(select(getUser));

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private store: Store<CoreState>
  ) { }

  //
  listAvailableDevices(): Observable<Device[]> {
    return this.afAuth.authState
        .pipe(
          filter(user => user !== null),
          switchMap(user => Observable.fromPromise(user.getIdToken())),
          switchMap(idToken => this.http.get<Device[]>("api/device", {
            headers: new HttpHeaders({
              "Authorization": idToken
            })
          }))
        );
  }
}
