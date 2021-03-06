import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatCheckboxModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatButtonModule,
  MatCardModule,
  MatSidenavModule,
  MatSliderModule
} from "@angular/material";

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatSliderModule
  ]
})
export class SharedModule { }
