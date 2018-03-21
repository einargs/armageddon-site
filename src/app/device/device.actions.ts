import { Device } from "./device";

export enum DeviceActionTypes {
  LOAD_ACCESSIBLE_DEVICES = "[Device] Load Accessible Devices",
  DEVICES_LOADED = "[Device] Devices Loaded",
  SELECT_DEVICE = "[Device] Select Device",
  CHANGE_DEVICE_CONFIG = "[Device] Change Device Config",
  LOAD_DEVICE_BY_ID = "[Device] Load Device By Id",
  ENSURE_DEVICES_ARE_LOADED = "[Device] Ensure Devices Are Loaded"
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

export interface LoadDevicesByIdPayload {
  deviceIds: string[];
}

export class LoadDevicesById {
  readonly type = DeviceActionTypes.LOAD_DEVICE_BY_ID;

  constructor (public payload: LoadDevicesByIdPayload) {}
}

export interface EnsureDevicesAreLoadedPayload {
  deviceIds: string[];
}

export class EnsureDevicesAreLoaded {
  readonly type = DeviceActionTypes.ENSURE_DEVICES_ARE_LOADED;

  constructor (public payload: EnsureDevicesAreLoadedPayload) {}
}

export type DeviceAction
    = LoadAccessibleDevices
    | DevicesLoaded
    | SelectDevice
    | ChangeDeviceConfig
    | LoadDevicesById;
