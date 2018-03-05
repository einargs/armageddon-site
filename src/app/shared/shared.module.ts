import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import {
  MatCheckboxModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatButtonModule
} from "@angular/material";

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    FormsModule,
    CommonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule
  ]
})
export class SharedModule { }
