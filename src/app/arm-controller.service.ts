import { Injectable } from '@angular/core';
import { Socket } from "ng-socket-io";

@Injectable()
export class ArmControllerService {

  constructor(
    private socket: Socket
  ) { }

  msg(text: string): void {
    this.socket.emit("msg", text);
  }

  setLed(ledId: string, status: boolean): void {
    console.log("Set builtin led to ", status);
    this.msg(`LT:${ledId}:${status?"on":"off"};`);
  }
}
