import * as functions from 'firebase-functions';
import { google } from "googleapis";
import * as firebaseAdmin from "firebase-admin";

//process.env.GOOGLE_APPLICATION_CREDENTIALS = "/home/einargs/Auth/armageddon-cloud/device-lister-service-account.json";
interface User {
  uid: string;
}

interface DeviceState {
  reserved: boolean;
  allowedUsers: Array<string>;
}

interface Device {
  blocked: boolean;
  lastHeartbeatTime: string;
  state: DeviceState;
}

// Constants
const MAX_TIME_SINCE_LAST_HEARTBEAT = 10 * 60 * 1000; // 10 minutes
const IOT_ARM_DEVICES_CONFIG = {
  projectId: "armageddon-cloud",
  cloudRegion: "us-central1",
  registryId: "arm-devices",
};

// Should the device be shown to the user?
function isDeviceAvailable(device: Device, user: User) {
  const blocked = device.blocked;
  const timeSinceHeartbeat = Date.now() - Date.parse(device.lastHeartbeatTime);
  const recentHeartbeat = timeSinceHeartbeat < MAX_TIME_SINCE_LAST_HEARTBEAT;
  const reserved = device.state.reserved;
  const userAllowed = device.state.allowedUsers.includes(user.uid);
  return !blocked && !reserved && recentHeartbeat && userAllowed;
}


//
async function getIotClient() {
  const { credential, projectId } = await google.auth.getApplicationDefault();
  const configuredCredential = credential;
  // Commented out because typescript is throwing fits about type errors.
  // I guess this might not be necessary? Maybe new stuff is handling this.
  // That, or someone forgot to consider something while writing the typescript.
  /*const createScoped =
      credential.createScopedRequired && credential.createScopedRequired();

  const configuredCredential = createScoped ?
      credential.createScoped([
        "email",
        "openid",
        "https://www.googleapis.com/auth/cloudplatformprojects.readonly",
        "https://www.googleapis.com/auth/firebase",
        "https://www.googleapis.com/auth/cloud-platform"
      ]) : credential;*/

  return google.cloudiot({
    version: "v1",
    auth: configuredCredential
  });
}

//
async function getUserFromToken(token): Promise<User> {
  return await firebaseAdmin.auth().verifyIdToken(token);
}

//
async function listDevices(
    { registryId, projectId, cloudRegion }): Promise<Device[]> {
  const iotClient = await getIotClient();
  const parentName = `projects/${projectId}/locations/${cloudRegion}`;
  const registryName = `${parentName}/registries/${registryId}`;

  const request = {
    parent: registryName
  };

  const response: any = await new Promise((resolve, reject) => {
    iotClient.projects.locations.registries.devices.list(request, (err, data) => {
      resolve(data);
    });
  });

  return response.data.devices;
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const httpListDevices = functions.https.onRequest(async (req, res) => {
  const devices = await listDevices(IOT_ARM_DEVICES_CONFIG);
  res.json(devices);
});

const httpListAvailableDevices = functions.https.onRequest(async (req, res) => {
  const idToken = req.body.message.idToken;
  const userPromise = getUserFromToken(idToken);

  const devices = await listDevices(IOT_ARM_DEVICES_CONFIG);
  const user = await userPromise; // Necessary to maintain parallelism.
  const availableDevices = devices.map(device => isDeviceAvailable(device, user));

  res.json(availableDevices);
});

export {
  httpListDevices,
  httpListAvailableDevices
};