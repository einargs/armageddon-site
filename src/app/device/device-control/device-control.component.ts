import { Component, OnDestroy } from '@angular/core';
import {
  FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { map, take } from "rxjs/operators";

import { ArmGeometry } from "../arm-model/animation";

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

  armGeometry: ArmGeometry = [
    {x:0, y:3, z:0}, //V0
    {x:0, y:40, z:0}, //V1
    {x:6.5, y:0, z:-5.5}, //V2
    {x:27.5, y:0, z:0}, //V3
    {x:0, y:4.5, z:0}, //V4
  ];

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

  sendConfig(rawJointAngles: number[]) {
    //NOTE: this is basically just for paranoia.
    // This limits the angles to four decimal places.
    const jointAngles = rawJointAngles.map(num => num.toFixed(4));
    const model = {
      leds: {
        builtin: true //TEMP
      },
      motors: {
        base: jointAngles[0],
        shoulder: jointAngles[1],
        elbow: jointAngles[2],
        horizontal: jointAngles[3],
        vertical: jointAngles[4],
        rotation: jointAngles[5]
      }
    };

    this.configureDevice(model);
  }

  configureDevice(newConfig: DeviceConfig) {
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
