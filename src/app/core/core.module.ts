import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { environment } from "../../environments/environment";
import { AuthModule } from "../auth/auth.module";
import { AuthEffects } from "../auth/auth.effects";
import { coreReducers, initialCoreState } from "./core.reducer";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    StoreModule.forRoot(coreReducers, {
      initialState: initialCoreState
    }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // number of past states to retain
      logOnly: environment.production // Disable other features while in prod.
    }),
    AuthModule
  ],
  declarations: [],
  exports: [
    AuthModule
  ]
})
export class CoreModule { }
