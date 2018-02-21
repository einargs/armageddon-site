import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlPageComponent } from "./control-page/control-page.component";

const routes: Routes = [
  { path:"", component: ControlPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
