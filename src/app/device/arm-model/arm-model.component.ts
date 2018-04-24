import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  ArmApp,
  ArmGeometry,
  TransformControlMode
} from "./animation";

@Component({
  selector: 'arm-arm-model',
  templateUrl: './arm-model.component.html',
  styleUrls: ['./arm-model.component.scss']
})
export class ArmModelComponent implements AfterViewInit, OnDestroy {
  armApp?: ArmApp;

  resizeCanvas = () => {
    const container = this.containerEl;
    const height = container.clientHeight;
    const width = container.clientWidth;
    this.armApp.resize(width, height);
  };

  // Backing field for arm geometry input
  private _armGeometry: ArmGeometry;

  @ViewChild("targetCanvas") canvasRef: ElementRef;
  @ViewChild("canvasContainer") containerRef: ElementRef;

  get canvasEl(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  get containerEl(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @Input()
  set armGeometry(val: ArmGeometry) {
    // Store the value
    this._armGeometry = val;
    // If the arm app is initialized, update it's geometry
    if (this.ready) {
      this.armApp.arm.updateGeometry(val);
    }
  }
  get armGeometry(): ArmGeometry {
    return this._armGeometry;
  }

  @Input()
  transformControlMode: TransformControlMode;

  /*TODO: proper event handling
  @Output()
  jointAnglesChange = new EventEmitter<number[]>();
  */

  public get ready(): boolean {
    return Boolean(this.armApp);
  }

  public get jointAngles(): number[] | null {
    if (this.ready) {
      return this.armApp.jointAngles;
    } else {
      return null;
    }
  }

  constructor() {}

  ngAfterViewInit() {
    this.armApp = new ArmApp({
      targetCanvasElement: this.canvasEl,
      armGeometry: this.armGeometry,
      gridConfig: {
        size: 60,
        divisions: 30
      },
      segmentScale: 5,
      initialCameraPosition: {
        x: 20, y: 40, z: 20
      },
      initialCameraLookAt: {
        x: 0, y: 0, z: 0
      },
      initialTarget: {
        x: 10, y: 20, z: 10,
        a: 0, b: 0, c: 0
      }
    });
    this.armApp.startRendering();
    this.resizeCanvas();

    window.addEventListener("resize", this.resizeCanvas);
  }

  ngOnDestroy() {
    this.armApp.stopRendering();
    window.removeEventListener("resize", this.resizeCanvas);
  }

  toggleControlMode() {
    if (this.armApp) {
      this.armApp.toggleControlMode();
    }
  }

}
