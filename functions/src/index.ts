import * as functions from 'firebase-functions';
import { google } from "googleapis";
import * as firebaseAdmin from "firebase-admin";

// Initialize firebase admin
firebaseAdmin.initializeApp(functions.config().firebase);

// Constants
const MAX_TIME_SINCE_LAST_HEARTBEAT = 10 * 60 * 1000; // 10 minutes
const IOT_ARM_DEVICES_CONFIG: RegistryDescription = {
  projectId: "armageddon-cloud",
  cloudRegion: "us-central1",
  registryId: "arm-devices",
};
// Fields that should be included in returned devices
const DEVICE_FIELD_MASK = [
  "blocked",
  "lastHeartbeatTime",
  "state"
].join(",");

// Interfaces
interface UserData {
  // Map of device ids to boolean values
  allowedDevices: {[id: string]: boolean;}
}

interface User {
  uid: string;
  data: UserData;
}

interface DeviceState {
  reserved: boolean;
  allowedUsers: string[];
}

interface Device {
  id: string;
  blocked: boolean;
  lastHeartbeatTime: string;
  state: DeviceState;
}

interface DeviceConfig {
  // Map of LED pin names to boolean on/off values
  leds: {[id: string]: boolean}
}

interface RegistryDescription {
  registryId: string;
  projectId: string;
  cloudRegion: string;
}

interface DeviceDescription extends RegistryDescription {
  deviceId: string;
}

// Decode the base64 buffers in a device response & otherwise reformat
// the direct API response.
// See https://cloud.google.com/iot/docs/reference/cloudiot/rest/v1/projects.locations.registries.devices#resource-device
// for documentation on the original formats.
function decodeDevice(device: any) {
  return {
    id: device.id,
    blocked: device.blocked,
    lastHeartbeatTime: device.lastHeartbeatTime,
    state: JSON.parse(
        Buffer.from(device.state.binaryData, "base64").toString("utf8"))
  }
}

// Is a user allowed to configure this device?
function canUserConfigureDevice(deviceId: string, user: User): boolean {
  return user.data.allowedDevices[deviceId];
}

// Is a user allowed to access this device?
function canUserAccessDevice(deviceId: string, user: User): boolean {
  return user.data.allowedDevices[deviceId];
}

//
//TODO: consider caching the promise/result in a global variable, per:
// https://firebase.google.com/docs/functions/tips#use_global_variables_to_reuse_objects_in_future_invocations
async function getIotClient() {
  const { credential, projectId } = await google.auth.getApplicationDefault();
  const configuredCredential = credential;

  return google.cloudiot({
    version: "v1",
    auth: configuredCredential
  });
}

// Get the user id from the token and app-specific user data from firestore.
async function getUserFromToken(token): Promise<User> {
  const user = await firebaseAdmin.auth().verifyIdToken(token);
  const userData: any = (await firebaseAdmin.firestore()
      .doc(`users/${user.uid}`)
      .get()).data();

  return {
    uid: user.uid,
    data: userData
  };
}

// Generate the appropriate path to a device registry
function makeRegistryName(registryDescription: RegistryDescription) {
  const { registryId, projectId, cloudRegion } = registryDescription;
  const parentName = `projects/${projectId}/locations/${cloudRegion}`;
  const registryName = `${parentName}/registries/${registryId}`;
  return registryName;
}

// Generate the appropriate path to a device in a registry
function makeDeviceName(deviceDescription: DeviceDescription) {
  const { deviceId } = deviceDescription;

  // Device description extends registry description
  // Which means that a device description can be passed to
  // makeRegistryName to get the registry of the device.
  const registryName = makeRegistryName(deviceDescription);
  const deviceName = `${registryName}/devices/${deviceId}`;

  return deviceName;
}

// Extend a RegistryDescription with a deviceId to create a DeviceDescription
function describeDeviceInRegistry(
    registry: RegistryDescription, deviceId: string): DeviceDescription {
  return {
    ...registry,
    deviceId
  }
}


// Get several devices by id
// NOTE that this function does not verify that a user is allowed to access the
// fetched resource. The caller of this function is responsible for restricting
// user access.
async function getDevices(
    registryDescription: RegistryDescription,
    deviceIds: string[]): Promise<Device[]> {
  const iotClient = await getIotClient();
  const registryName = makeRegistryName(registryDescription);

  const apiRequestParameters = {
    // The registry the device is in
    parent: registryName,
    // The ids of the devices that should be returned
    // NOTE this means that the only devices returned are allowed devices
    deviceIds: deviceIds,
    // The fields that should be returned in the request
    fieldMask: DEVICE_FIELD_MASK
  };

  // Make the request to the API & await the response
  const apiResponse: any = await new Promise((resolve, reject) => {
    iotClient.projects.locations.registries.devices.list(
        apiRequestParameters, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
  });

  // Map the raw API format of the devices to a friendlier version
  const devices = apiResponse.data.devices.map(decodeDevice);

  return devices;
}

// Modify a device's configuration.
// NOTE: This function assumes that authentication has already been performed,
// and in no way checks user permissions to perform this action.
async function modifyDeviceConfiguration(
    deviceDescription: DeviceDescription, newConfig: DeviceConfig) {
  const iotClient = await getIotClient();
  const deviceName = makeDeviceName(deviceDescription);

  const apiRequestParameters = {
    name: deviceName,
    resource: {
      versionToUpdate: "0",
      binaryData: Buffer.from(JSON.stringify(newConfig)).toString("base64")
    }
  };

  const apiResponse: any = await new Promise((resolve, reject) => {
    iotClient.projects.locations.registries.devices.modifyCloudToDeviceConfig(
        apiRequestParameters, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
  });
}

// HTTP functions
//TODO: Add proper error handling. See listAccessibleDevices for more detail.
export const listDevices = functions.https.onRequest(async (req, res) => {
  // Get the user id token from the Authorization header
  const idToken = req.get("Authorization");
  // use that token to get user information
  const user = await getUserFromToken(idToken);

  // Get the ids of the requested devices from the url query parameters
  const deviceIdsRaw: string | string[] = req.query.deviceIds;
  const deviceIds: string[] =
      (Array.isArray(deviceIdsRaw)
      ? deviceIdsRaw
      : [deviceIdsRaw]) as string[];

  // If any of the requested devices are not accessible by the user,
  // end the response with an error status code.
  if (!deviceIds.every(id => user.data.allowedDevices[id])) {
    res.status(401).end(); //401: Unauthorized/not authorized for this
  } else {
    const devices = await getDevices(
        IOT_ARM_DEVICES_CONFIG, deviceIds);
    res.status(200).json(devices);
  }
});

export const listAccessibleDevices = functions.https.onRequest(async (req, res) => {
  //TODO: Refine the try-catch. Figure out how to be more granular
  // so that I can give unique error messages and status codes for each failure--
  // so if getUserFromToken fails, there's an "Authorization not accepted" error,
  // but if getting the device fails, something different happens. I may need
  // to dip into throwing my own errors.
  try {
    const idToken = req.get("Authorization"); // Get the authorization header
    const user = await getUserFromToken(idToken);

    const userDevices = await getDevices(
        IOT_ARM_DEVICES_CONFIG, Object.keys(user.data.allowedDevices));

    res.status(200).json(userDevices);
  } catch (error) {
    console.error("Error while getting user");
    console.error(error);
    res.status(500).end(); //500: internal server error
  }
});

//TODO:add sanitization!
export const configureDevice = functions.https.onRequest(async (req, res) => {
  const deviceId: string = req.body.deviceId;
  const deviceDescription: DeviceDescription =
      describeDeviceInRegistry(IOT_ARM_DEVICES_CONFIG, deviceId);
  const newConfigUnsanitized: any = req.body.config;
  const newConfig = typeof newConfigUnsanitized === "string"
      ? JSON.parse(newConfigUnsanitized)
      : newConfigUnsanitized;
  const idToken = req.get("Authorization");

  try {
    const user = await getUserFromToken(idToken);

    // Verify that the user can configure the device
    if (canUserConfigureDevice(deviceId, user)) {
      try {
        await modifyDeviceConfiguration(deviceDescription, newConfig);
      } catch (error) {
        console.error("Error while changing device config");
        console.error(error);
        res.status(500).end();
      }

      res.status(204).end(); //204: Proccessed successfully, not returning content
    } else {
      res.status(401).end(); //401: Unauthorized/not authorized for this
    }
  } catch (error) {
    console.error("Error while getting user");
    console.error(error);
    res.status(500).end(); //500: internal server error
  }
});
