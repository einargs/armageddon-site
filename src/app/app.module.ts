import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SocketIoModule } from "ng-socket-io";

import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { ArmControllerService } from "./arm-controller.service";
import { AppComponent } from './app.component';
import { ControlPageComponent } from "./control-page/control-page.component";

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ControlPageComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SocketIoModule.forRoot({
      url: "http://localhost:3000"
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ArmControllerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
