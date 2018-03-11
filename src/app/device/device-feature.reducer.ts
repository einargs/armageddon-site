/*
Manages state for the entire feature. Due to a lack of foresight (primarily
caused by inexperience with NgRx), I wasn't able to pick out a nice, distinct
name.
*/
import { createSelector, createFeatureSelector, ActionReducerMap } from "@ngrx/store";

import { CoreState } from "../core/core.reducer";
import { DeviceState, deviceReducer, deviceAdapter, initialDeviceState } from "./device.reducer";

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

export const getDeviceIndex = createSelector(
    getDeviceState, deviceAdapterSelectors.selectEntities);

export const getAllDevices = createSelector(
    getDeviceState, deviceAdapterSelectors.selectAll);

export const getSelectedDeviceId = createSelector(
    getDeviceState, state => state.selectedDeviceId);

export const getSelectedDevice = createSelector(
    getDeviceIndex, getSelectedDeviceId,
    (deviceIndex, selectedDeviceId) =>
        selectedDeviceId ? deviceIndex[selectedDeviceId] : null);
