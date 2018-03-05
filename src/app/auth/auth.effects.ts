import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from "firebase/app";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { LogOut, LoggedIn, LogInWithGoogle, AuthActionTypes } from "./auth.actions";

type FirebaseUser = firebase.User;

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  logInWithGoogle$: Observable<void> =
      this.actions$.pipe(
          ofType(AuthActionTypes.LOG_IN_WITH_GOOGLE),
          mergeMap((action: LogInWithGoogle) => this.logInWithGoogle())
      );

  @Effect()
  authStateChange$: Observable<any> =
      this.afAuth.authState.pipe(
          map((user: FirebaseUser) => this.mapAuthState(user))
      );

  constructor(
    private afAuth: AngularFireAuth,
    private actions$: Actions
  ) {}

  // Converts promise to void observable
   //TODO: error handling
  private logInWithGoogle(): Observable<void> {
    const logInPromise = this.afAuth.auth.signInWithRedirect(
        new firebase.auth.GoogleAuthProvider());

    // Wrap the promise as an observable & return it
    return Observable.fromPromise(logInPromise);
  }

  private mapAuthState(user?: FirebaseUser): LoggedIn | LogOut {
    return user
        ? new LoggedIn({ userId: user.uid, displayName: user.displayName })
        : new LogOut();
  }
}
