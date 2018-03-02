import { ActionReducerMap } from "@ngrx/store";

import { AuthState } from "../auth/auth.actions";
import { authReducer } from "../auth/auth.reducer";

export interface CoreState {
  auth: AuthState;
}

export const coreReducers: ActionReducerMap<CoreState> = {
  auth: authReducer
};
