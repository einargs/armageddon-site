import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Device } from "./device";
import { DeviceAction, DeviceActionTypes } from "./device.actions";

export interface DeviceState extends EntityState<Device> {
  selectedDeviceId: string | null;
}

export const deviceAdapter = createEntityAdapter<Device>({
  selectId: device => device.id,
  sortComparer: false
});

export const initialDeviceState: DeviceState = deviceAdapter.getInitialState({
  selectedDeviceId: null
});

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
