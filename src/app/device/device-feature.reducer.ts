/*
Manages state for the entire feature. Due to a lack of foresight (primarily
caused by inexperience with NgRx), I wasn't able to pick out a nice, distinct
name.
*/
import { createSelector, createFeatureSelector, ActionReducerMap } from "@ngrx/store";
import { Dictionary } from "@ngrx/entity/src/models";

import { CoreState } from "../core/core.reducer";
import { DeviceState, deviceReducer, deviceAdapter, initialDeviceState } from "./device.reducer";
import { Device } from "./device";

export type DeviceDictionary = Dictionary<Device>;

export interface DeviceFeatureState {
  device: DeviceState;
}

export interface State extends CoreState {
  deviceFeature: DeviceFeatureState;
}

export const initialDeviceFeatureState: DeviceFeatureState = {
  device: initialDeviceState
};

export const deviceFeatureReducers: ActionReducerMap<DeviceFeatureState> = {
  device: deviceReducer
};

export const getDeviceFeature = createFeatureSelector<DeviceFeatureState>("deviceFeature");

export const getDeviceState = createSelector(
    getDeviceFeature, deviceFeature => deviceFeature.device);

const deviceAdapterSelectors = deviceAdapter.getSelectors();

export const getDeviceDictionary = createSelector(
    getDeviceState, deviceAdapterSelectors.selectEntities);

export const getAllDeviceIds = createSelector(
    getDeviceState, deviceAdapterSelectors.selectIds);

export const getAllDevices = createSelector(
    getDeviceState, deviceAdapterSelectors.selectAll);

export const getSelectedDeviceId = createSelector(
    getDeviceState, state => state.selectedDeviceId);

export const getSelectedDevice = createSelector(
    getDeviceDictionary, getSelectedDeviceId,
    (deviceDictionary, selectedDeviceId) =>
        selectedDeviceId ? deviceDictionary[selectedDeviceId] : null);
