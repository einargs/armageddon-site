import { google } from "googleapis";

import {
  Device, IotClient, RegistryDescription, OAuth2Client } from "./iot-client";

// Constants
export const ARM_REGISTRY: RegistryDescription = {
  projectId: "armageddon-cloud",
  cloudRegion: "us-central1",
  registryId: "arm-devices",
};


// Interfaces
// The list of fields in an ArmDevice object.
// Used to create a field mask that defines what fields the API should return.
// See https://cloud.google.com/iot/docs/reference/cloudiot/rest/v1/projects.locations.registries.devices#resource-device
// for more details.
export enum ArmField {
  blocked = "blocked",
  id = "id",
  lastHeartbeatTime = "lastHeartbeatTime"
}
const armFieldMask: ArmField[] =
    Object.keys(ArmField).map(key => ArmField[key]);

export interface ArmConfigData {
  // Map of LED pin names to boolean on/off values
  leds: {[id: string]: boolean}
}

export interface ArmStateData {

}

export interface ArmDevice extends Device<ArmField,ArmStateData,ArmConfigData> {

}

// ArmDevice-specific client
export class ArmClient extends IotClient<ArmDevice,ArmField,ArmStateData,ArmConfigData> {
  constructor(credential: OAuth2Client) {
    super(ARM_REGISTRY, armFieldMask, credential);
  }
}
