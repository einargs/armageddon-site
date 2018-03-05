import { ActionReducerMap } from "@ngrx/store";

import { AuthState, initialAuthState } from "../auth/auth.actions";
import { authReducer } from "../auth/auth.reducer";

export interface CoreState {
  auth: AuthState;
}

export const initialCoreState = {
  auth: initialAuthState
};

export const coreReducers: ActionReducerMap<CoreState> = {
  auth: authReducer
};
