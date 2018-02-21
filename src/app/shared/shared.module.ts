import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import {
  MatCheckboxModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";

@NgModule({
  imports: [
  ],
  declarations: [],
  exports: [
    FormsModule,
    CommonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class SharedModule { }
