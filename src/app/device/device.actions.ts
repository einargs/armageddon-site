import { Device, DeviceConfig } from "./device";

export enum DeviceActionTypes {
  LOAD_ACCESSIBLE_DEVICES = "[Device] Load Accessible Devices",
  DEVICES_LOADED = "[Device] Devices Loaded",
  SELECT_DEVICE = "[Device] Select Device",
  CONFIGURE_DEVICES = "[Device] Configure Devices",
  LOAD_DEVICES_BY_ID = "[Device] Load Devices By Id",
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

export interface ConfigureDeviceRequest {
  deviceId: string;
  newConfig: DeviceConfig;
}

export class ConfigureDevices {
  readonly type = DeviceActionTypes.CONFIGURE_DEVICES;

  constructor(public payload: ConfigureDeviceRequest[]) {}
}

export interface LoadDevicesByIdPayload {
  deviceIds: string[];
}

export class LoadDevicesById {
  readonly type = DeviceActionTypes.LOAD_DEVICES_BY_ID;

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
    | ConfigureDevices
    | LoadDevicesById;
