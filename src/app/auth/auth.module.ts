import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "../shared/shared.module";
import { AuthStatusComponent } from './auth-status/auth-status.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [AuthStatusComponent],
  exports: [AuthStatusComponent]
})
export class AuthModule { }
