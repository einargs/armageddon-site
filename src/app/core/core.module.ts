import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { environment } from "../../environments/environment";
import { AuthEffects } from "../auth/auth.effects";
import { coreReducers } from "./core.reducer";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot(coreReducers)
  ],
  declarations: []
})
export class CoreModule { }
