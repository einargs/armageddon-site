import * as functions from 'firebase-functions';
import { google } from "googleapis";
import * as express from "express";

import { ArmClient, ArmConfigData } from "./arm-client";
import {
  getUserFromToken,
  User,
  canUserAccessDevice,
  canUserConfigureDevice } from "./user";

// Utility functions
async function getIotClient(): Promise<ArmClient> {
  const { credential, projectId } = await google.auth.getApplicationDefault();

  return new ArmClient(credential);
}


// Globally cached results.
//
// Cloud function environments can be re-used multiple times for different
// requests; globally caching the results of compultationally expensive
// operations or time-consuming network requests can speed up future invocations.
//
// See docs on warm functions/cold starts for more details.

// Cache the iotClient promise so that multiple function invocations can use it.
const armClientPromise = getIotClient();


// Setup the Express app
const app = express();

// User middleware
//NOTE: this is probably needed for every route, but may not be (e.g. there is
// some portion of the API we want to ).
// In such a case, extract this into
app.use(async (req, res, next) => {
  const idToken = req.get("Authorization");
  const user = await getUserFromToken(idToken);
  res.locals.user = user;
  next();
});

//TODO: pagination (preferably through an opaque cursor).
// Get devices. Used even for a single device.
// Query methods:
// * /some/path?allUserDevices=true
//   Signifies that all devices the user owns should be returned.
// * /some/path?deviceIds={deviceId1}&deviceIds={deviceId2}
//   Use for several devices, or even just a single device.
app.get("/api/devices", async (req, res, next) => {
  try {
    // Prepare variables used in all (or most) situations.
    const { user } = res.locals;
    const armClient = await armClientPromise;

    // Return all devices owned by the requesting user
    if (req.query.allUserDevices === "true") {
      const userDeviceIds = Object.keys(user.data.allowedDevices);
      const userDevices = await armClient.getDevices(userDeviceIds);
      //TODO: consider using new-line deliminated JSON
      res.status(200).json(userDevices);
    }

    // Return the requested device ids
    else if (req.query.deviceIds) {
      // If there's only a single deviceIds=someId in the URL query, the
      // parser turns it into a string, not an array of strings. This converts
      // any strings into a one-element string array.
      const rawDeviceIds: string | string[] = req.query.deviceIds;
      const deviceIds: string[] =
          Array.isArray(rawDeviceIds)
          ? rawDeviceIds
          : [rawDeviceIds];

      // Make sure that the user can access each device id
      if (deviceIds.every(deviceId => canUserAccessDevice(user, deviceId))) {
        const devices = await armClient.getDevices(deviceIds);
        res.status(200).json(devices);
      }
      // If the user isn't allowed to access a device id, tell the client they
      // aren't authorized to get one or more of the devices they requested.
      else {
         // HTTP 403: not authorized to perform this action
        res.status(403).json({
          error: "User lacks permission to access one or more of the requested devices"
        });
      }
    }

    // If none of the criteria match, tell the client the request is malformed.
    else {
      // HTTP 400: Bad request
      res.status(400).json({
        error: "URL query lacked recognizable parameters"
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Update one or more devices.
// The body of a request contains an array of JSON objects. Each object
//
app.put("/api/devices", async (req, res) => {
  // The format of an individual request to configure a device.
  interface ConfigureDeviceRequest {
    deviceId: string;
    newConfig: ArmConfigData;
  }
  const configRequests: ConfigureDeviceRequest[] = req.body;
  const targetedDeviceIds = configRequests.map(configReq => configReq.deviceId);
  const user = res.locals.user;
  const armClient = await armClientPromise;

  // Make sure the user is allowed to configure all of the targeted devices
  if (targetedDeviceIds.every(id => canUserConfigureDevice(user, id))) {
    try {
      await Promise.all(
          configRequests.map(
              (conReq: ConfigureDeviceRequest) =>
                  armClient.configureDevice(conReq.deviceId, conReq.newConfig)));
      res.status(200).end();
    } catch (error) {
      console.error("Error while configuring devices in PUT /api/devices", error);
      res.status(500).end();
    }
  }
  // If the user isn't allowed to configure one or more of the devices
  else {
    // HTTP 403: not authorized to perform this action
    res.status(403).json({
      error: "User lacks permission to configure one or more of the targeted devices"
    });
  }
});

// Export the function
export const apiRoot = functions.https.onRequest(app);
