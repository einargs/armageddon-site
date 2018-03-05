import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";

import { User } from "../auth.actions";
import { getLoggedIn, getUser } from "../auth.reducer";
import { LogInWithGoogle, LogOut } from "../auth.actions";
import { CoreState } from "../../core/core.reducer";

//TODO: refactor the position of this. It should probably go in
// the core module, not auth. Auth is a service oriented module.
// It isn't responsible for displaying authentication state.
// I could make a seperate feature module for that--call it user?
// But that's just confusing. I'll think of something.
@Component({
  selector: 'arm-auth-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-status.component.html',
  styleUrls: ['./auth-status.component.scss']
})
export class AuthStatusComponent {
  loggedIn$: Observable<boolean> = this.store.pipe(select(getLoggedIn));

  constructor(
    private store: Store<CoreState>
  ) { }

  logOut() {
    this.store.dispatch(new LogOut());
  }

  logIn() {
    this.store.dispatch(new LogInWithGoogle());
  }
}
