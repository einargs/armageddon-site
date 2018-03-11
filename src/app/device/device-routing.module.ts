import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceListComponent } from "./device-list/device-list.component";
import { DeviceControlComponent } from "./device-control/device-control.component";

const routes: Routes = [
  { path: "", component: DeviceListComponent },
  { path: ":id", component: DeviceControlComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }
