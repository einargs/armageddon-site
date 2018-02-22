import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Device } from "../device";
import { DeviceListerService } from "../device-lister.service";

@Component({
  selector: 'arm-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  devices: Observable<Device[]>;

  constructor(
    private deviceLister: DeviceListerService
  ) {
    this.devices = this.deviceLister.listAvailableDevices();
  }

  ngOnInit() {
  }

}
