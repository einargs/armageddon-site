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
  MatSliderModule,
  MatIconModule
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
    MatSliderModule,
    MatIconModule
  ]
})
export class SharedModule { }
