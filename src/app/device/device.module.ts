import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "../shared/shared.module";

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceListerService } from "./device-lister.service";
import { DeviceListComponent } from './device-list/device-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DeviceRoutingModule
  ],
  declarations: [DeviceListComponent],
  providers: [DeviceListerService]
})
export class DeviceModule { }
