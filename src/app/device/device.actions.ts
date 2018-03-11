import { Device } from "./device";

export enum DeviceActionTypes {
  LOAD_ACCESSIBLE_DEVICES = "[Device] Load Accessible Devices",
  DEVICES_LOADED = "[Device] Devices Loaded",
  SELECT_DEVICE = "[Device] Select Device",
  CHANGE_DEVICE_CONFIG = "[Device] Change Device Config"
}

export class LoadAccessibleDevices {
  readonly type = DeviceActionTypes.LOAD_ACCESSIBLE_DEVICES;
}

export class DevicesLoaded {
  readonly type = DeviceActionTypes.DEVICES_LOADED;

  constructor(public payload: {devices: Device[]}) {}
}

export class SelectDevice {
  readonly type = DeviceActionTypes.SELECT_DEVICE;

  constructor(public payload: {deviceId: string}) {}
}

export interface ChangeDeviceConfigPayload {
  deviceId: string;
  newConfig: any;
}

export class ChangeDeviceConfig {
  readonly type = DeviceActionTypes.CHANGE_DEVICE_CONFIG;

  constructor(public payload: ChangeDeviceConfigPayload) {}
}

export type DeviceAction
    = LoadAccessibleDevices
    | DevicesLoaded
    | SelectDevice
    | ChangeDeviceConfig;
