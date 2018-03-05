import { Action } from "@ngrx/store";

export interface User {
  userId: string;
  displayName: string;
}

export interface AuthState {
  userLoggedIn: boolean;
  user: User;
}

export const initialAuthState = {
  userLoggedIn: false,
  user: null
};

export enum AuthActionTypes {
  LOG_IN_WITH_GOOGLE = "[Auth] LOG_IN_WITH_GOOGLE",
  LOGGED_IN= "[Auth] LOGGED_IN",
  LOG_OUT = "[Auth] LOG_OUT"
}

export class LogInWithGoogle implements Action {
  readonly type = AuthActionTypes.LOG_IN_WITH_GOOGLE;
}

export class LoggedIn implements Action {
  readonly type = AuthActionTypes.LOGGED_IN;

  constructor(
    public payload: User
  ) {}
}

export class LogOut implements Action {
  readonly type = AuthActionTypes.LOG_OUT;
}

export type AuthAction
    = LogInWithGoogle
    | LoggedIn
    | LogOut;
