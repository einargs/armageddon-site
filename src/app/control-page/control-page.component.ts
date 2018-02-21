import { Component, OnInit } from '@angular/core';

import { ArmControllerService } from "../arm-controller.service";

@Component({
  selector: 'arm-control-page',
  templateUrl: './control-page.component.html',
  styleUrls: ['./control-page.component.scss']
})
export class ControlPageComponent implements OnInit {

  constructor(
    private arm: ArmControllerService
  ) { }

  ngOnInit() {
  }

  updateLed(status: boolean): void {
    this.arm.setLed("8",status);
  }

  send(text: string) {
    console.log("message", text);
    this.arm.msg(text);
  }

}
