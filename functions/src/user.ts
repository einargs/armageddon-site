import * as functions from 'firebase-functions';
import * as firebaseAdmin from "firebase-admin";

// Initialize firebase admin with environmental configuration information
firebaseAdmin.initializeApp();

export interface UserData {
  // Map of device ids to boolean values
  allowedDevices: {[id: string]: boolean;}
}

export interface User {
  uid: string;
  data: UserData;
}

// Get the user id from the token and app-specific user data from firestore.
export async function getUserFromToken(token: string): Promise<User> {
  const user = await firebaseAdmin.auth().verifyIdToken(token);
  const userDocumentSnapShot = await firebaseAdmin.firestore()
      .doc(`users/${user.uid}`)
      .get();
  const userData: UserData = userDocumentSnapShot.data() as UserData;

  return {
    uid: user.uid,
    data: userData
  };
}

export function canUserAccessDevice(user: User, deviceId: string) {
  return user.data.allowedDevices[deviceId];
}

export function canUserConfigureDevice(user: User, deviceId: string) {
  return user.data.allowedDevices[deviceId];
}
