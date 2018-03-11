import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { SharedModule } from "../shared/shared.module";

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceEffects } from "./device.effects";
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceControlComponent } from './device-control/device-control.component';
import { deviceFeatureReducers, initialDeviceFeatureState } from "./device-feature.reducer";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DeviceRoutingModule,
    StoreModule.forFeature("deviceFeature", deviceFeatureReducers, {
      initialState: initialDeviceFeatureState
    }),
    EffectsModule.forFeature([DeviceEffects])
  ],
  declarations: [DeviceListComponent, DeviceControlComponent],
  providers: []
})
export class DeviceModule { }
