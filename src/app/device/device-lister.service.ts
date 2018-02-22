import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { Device} from "./device";

@Injectable()
export class DeviceListerService {

  constructor(
    private http: HttpClient
  ) { }

  //
  listAvailableDevices(): Observable<Device[]> {
    return this.http.get<Device[]>("/api/device");
  }
}
