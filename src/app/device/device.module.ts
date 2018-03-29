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

// Angular Ahead-Of-Time compilation does not support non-statically resolvable
// tokens inside of decorators. Because I'm using an entity adapter, and the
// .getInitialState method that goes with that adapter, I have to work around
// this requirement by providing a function that returns the initial state
// instead. This is an option supported by NgRx; see the api documentation for
// the store module for more details:
// https://github.com/ngrx/platform/blob/master/docs/store/api.md
// The function also has to be exported for some reason? So yeah...
export function getInitialDeviceFeatureState() {
  return initialDeviceFeatureState
}

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DeviceRoutingModule,
    StoreModule.forFeature("deviceFeature", deviceFeatureReducers, {
      initialState: getInitialDeviceFeatureState
    }),
    EffectsModule.forFeature([DeviceEffects])
  ],
  declarations: [DeviceListComponent, DeviceControlComponent],
  providers: []
})
export class DeviceModule { }
