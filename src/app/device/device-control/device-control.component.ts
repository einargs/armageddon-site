import { Component, OnDestroy } from '@angular/core';
import { Store, select } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { map, take } from "rxjs/operators";

import { DeviceConfig } from "../device";
import {
  State,
  getSelectedDevice,
  getSelectedDeviceId } from "../device-feature.reducer";
import {
  SelectDevice,
  LoadAccessibleDevices,
  ConfigureDevices } from "../device.actions";

@Component({
  selector: 'arm-device-control',
  templateUrl: './device-control.component.html',
  styleUrls: ['./device-control.component.scss']
})
export class DeviceControlComponent implements OnDestroy {
  actionsSubscription: Subscription;
  selectedDevice$ = this.store.pipe(select(getSelectedDevice));
  selectedDeviceId$ = this.store.pipe(select(getSelectedDeviceId));

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>
  ) {
    // The store is an observer, which means that it can subscribe
    // to an observable. Specifically, it can subscribe to an observable
    // of actions, which it then internally dispatches.
    this.actionsSubscription = route.params
        .pipe(
            map(params => new SelectDevice({deviceId:params.id})))
        .subscribe(this.store);
  }

  configureDevice(newConfigJson: string) {
    const newConfig: DeviceConfig = JSON.parse(newConfigJson);
    console.log("New Config", newConfig);
    // I *think* this subscription should auto-unsubscribe.
    // TODO: check if this subscription hangs around, or if this is safe.
    // Also, figure out how to even check that in the first place--do I
    // need to look at documentation/source-code, or is there an actual tool?
    // A tool would be super-useful.
    this.selectedDeviceId$
        .pipe(
            take(1),
            map(deviceId => new ConfigureDevices([{
              deviceId: deviceId,
              newConfig: newConfig
            }]))
        )
        .subscribe(this.store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

}
