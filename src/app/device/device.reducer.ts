import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Device } from "./device";
import { DeviceAction, DeviceActionTypes } from "./device.actions";

import { environment } from "../../environments/environment";

export interface DeviceState extends EntityState<Device> {
  selectedDeviceId: string | null;
}

export const deviceAdapter = createEntityAdapter<Device>({
  selectId: device => device.id,
  sortComparer: false
});

const baseDeviceState: DeviceState = deviceAdapter.getInitialState({
  selectedDeviceId: null
});
// In dev mode, pre-load a device
export const initialDeviceState: DeviceState =
    environment.production
    ? baseDeviceState
    : deviceAdapter.addAll([{id:"arm-1"} as Device], baseDeviceState);

export function deviceReducer(
    state: DeviceState, action: DeviceAction): DeviceState {
  switch (action.type) {
    case DeviceActionTypes.DEVICES_LOADED: {
      return deviceAdapter.addAll(action.payload.devices, state);
    }

    case DeviceActionTypes.SELECT_DEVICE: {
      return {
        ...state,
        selectedDeviceId: action.payload.deviceId
      };
    }

    default: {
      return state;
    }
  }
}
