// TODO: figure out proper types for the google apis.
import { google } from "googleapis";


// Various types
// getting the correct type would require depending on an undeclared (i.e. not
// declared in *this* project's package.json) package (google-auth-library)
// that googleapis uses.
export type OAuth2Client = any;

export interface RegistryDescription {
  registryId: string;
  projectId: string;
  cloudRegion: string;
}

interface DeviceDescription extends RegistryDescription {
  deviceId: string;
}

export interface FullDevice<S,C> {
  id: string;
  blocked: boolean;
  lastHeartbeatTime: string;
  config: { // Enable once the client is setup to handle
    version: string;
    cloudUpdateTime: string;
    deviceAckTime: string;
    binaryData: C;
  };
  state: {
    updateTime: string;
    binaryData: S;
  }
}
export type DeviceField<S,C> = keyof FullDevice<S,C>;
export type Device<F extends DeviceField<S,C>, S, C> = {
  [K in F]: FullDevice<S,C>[K];
}

// The type of the devices in API responses, where the config and state are
// base64 encoded.
type ResponseDevice<F extends DeviceField<string, string>> = Device<F, string, string>;

type ApiCallback = (err: any, data: any) => void;


// Utility functions
function promisifyApi<R>(
    setupApiCall: (apiCallback: ApiCallback) => void
  ): Promise<R> {
  return new Promise((resolve, reject) => {
    setupApiCall((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Generate the appropriate path to a device registry
function makeRegistryName(
    registryDescription: RegistryDescription): string {
  const { registryId, projectId, cloudRegion } = registryDescription;
  const parentName = `projects/${projectId}/locations/${cloudRegion}`;
  const registryName = `${parentName}/registries/${registryId}`;
  return registryName;
}

// Generate the appropriate path to a device in a registry
function makeDeviceName(
    registryDescription: RegistryDescription,
    deviceId: string): string {
  // Device description extends registry description
  // Which means that a device description can be passed to
  // makeRegistryName to get the registry of the device.
  const registryName = makeRegistryName(registryDescription);
  const deviceName = `${registryName}/devices/${deviceId}`;

  return deviceName;
}

function parseJsonFromBase64<T>(base64: string): T {
  return JSON.parse(
      Buffer.from(base64, "base64").toString("utf8"));
}

// Decode the base64 buffers in a device response & otherwise reformat
// the direct API response.
// See https://cloud.google.com/iot/docs/reference/cloudiot/rest/v1/projects.locations.registries.devices#resource-device
// for documentation on the original formats.
function decodeDevice<
    D extends Device<F,S,C>,
    F extends DeviceField<string,string>,
    S,
    C>(encodedDevice: ResponseDevice<F>): D {
  type R = ResponseDevice<F>;
  type EncodedDeviceEntry = [F, R[F]];
  type ReturnDeviceEntry = [F, D[F]];
  const device: D = {} as D;
  for (const key of Object.keys(encodedDevice)) {
    if (key === "state") {
      const state = encodedDevice.state;
      device[key] = {
        updateTime: state.updateTime,
        binaryData: parseJsonFromBase64(state.binaryData)
      };
    } else if (key === "config") {
      const config = encodedDevice.config;
      device[key] = {
        version: config.version,
        cloudUpdateTime: config.cloudUpdateTime,
        deviceAckTime: config.deviceAckTime,
        binaryData: parseJsonFromBase64(config.binaryData)
      };
    } else {
      device[key] = encodedDevice[key];
    }
  }
  return device;
}


// Wrapper for the google cloudiot api
export class IotClient<D extends Device<F,S,C>, F extends DeviceField<S,C>,S,C> {
  private googleIotApi: any;

  constructor(
      // A description of the device registry the client will operate within.
      private registry: RegistryDescription,
      // The default list of fields that should be requested.
      private defaultFieldMask: F[],
      // Credentials for the API to use.
      private credential: OAuth2Client) {
    this.googleIotApi = google.cloudiot({
      version: "v1",
      auth: credential
    });
  }

  //TODO: Add proper error handling/figure out what errors can throw
  public async configureDevice(deviceId: string, newConfig: C): Promise<void> {
    // Encode the new configuration as base64
    const base64EncodedConfig =
        Buffer.from(JSON.stringify(newConfig)).toString("base64");

    // Information about the request
    const apiRequest = {
      // API request parameters
      name: makeDeviceName(this.registry, deviceId),

      resource: {
        //Just add a version
        //TODO: figure out what the best practice for this is/how it's
        // meant/supposed to be used.
        versionToUpdate: "0",
        // Pass the new configuration as base64 encoded binary
        binaryData: base64EncodedConfig
      }
    };

    await promisifyApi<any>((callback: ApiCallback) => {
      this.googleIotApi.projects.locations.registries.devices
          .modifyCloudToDeviceConfig(apiRequest, callback);
    });
  }

  public async getDevices(
      deviceIds: string[],
      fieldMask: F[] = this.defaultFieldMask): Promise<D[]> {
    interface ApiResponse {
      data: {
        devices: ResponseDevice<F>[];
        nextPageToken: string;
      }
    }
    console.log("Field mask", fieldMask.join(","));
    const apiRequest = {
      parent: makeRegistryName(this.registry),
      deviceIds: deviceIds,
      fieldMask: fieldMask.join(",")
    };

    const apiResponse = await promisifyApi<ApiResponse>(
        (callback: ApiCallback) => {
          this.googleIotApi.projects.locations.registries.devices.list(
              apiRequest, callback);
        });

    // Have to use the arrow function to get around type errors--
    // I can't figure out the correct way to get typescript to narrow
    // the type of a function with type arguments without calling
    // it as a function.
    return apiResponse.data.devices.map(device => decodeDevice<D,F,S,C>(device));
  }
}
