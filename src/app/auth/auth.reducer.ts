import { createSelector, createFeatureSelector } from "@ngrx/store";

import { AuthState, AuthActionTypes, AuthAction } from "./auth.actions";

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGGED_IN:
      return { userLoggedIn: true, user: action.payload };
    case AuthActionTypes.LOG_OUT:
      return { userLoggedIn: false, user: null };
    default:
      return state;
  }
}

export const getAuthState = createFeatureSelector<AuthState>("auth");
export const getLoggedIn = createSelector(
    getAuthState,
    (source: AuthState) => source.userLoggedIn);
export const getUser = createSelector(
    getAuthState,
    (source: AuthState) => source.user);
