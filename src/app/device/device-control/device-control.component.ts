import { Component, OnDestroy } from '@angular/core';
import {
  FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
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

  configForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private fb: FormBuilder
  ) {
    // The store is an observer, which means that it can subscribe
    // to an observable. Specifically, it can subscribe to an observable
    // of actions, which it then internally dispatches.
    this.actionsSubscription = route.params
        .pipe(
            map(params => new SelectDevice({deviceId:params.id})))
        .subscribe(this.store);

    this.configForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      leds: this.fb.group({
        builtin: false //TEMP use device state/config for initial
      }),
      motors: this.fb.group({
        base: 0,
        shoulder: 0,
        elbow: 0,
        horizontal: 0,
        vertical: 0,
        rotation: 0
      }, { validators: Validators.required })
    });
  }

  submitConfiguration(): void {
    const model = {
      leds: {
        builtin: this.configForm.get("leds.builtin").value
      },
      motors: this.configForm.get("motors").value
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
