import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";

import { Device } from "../device";
import { State, getAllDevices } from "../device-feature.reducer";
import { LoadAccessibleDevices } from "../device.actions";

@Component({
  selector: 'arm-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  devices: Observable<Device[]> =
      this.store.pipe(select(getAllDevices));

  constructor(
    private store: Store<State>
  ) {
    this.store.dispatch(new LoadAccessibleDevices());
  }

  ngOnInit() {

  }

}
