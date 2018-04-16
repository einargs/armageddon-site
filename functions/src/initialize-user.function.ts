import * as functions from "firebase-functions";
import { firebaseAdmin } from "./firebase-app";

//
export const initializeUser = functions.auth.user().onCreate(async (
    user: firebaseAdmin.auth.UserRecord, context: functions.EventContext) => {
  firebaseAdmin.firestore()
      .doc(`users/${user.uid}`)
      .set({allowedDevices:{}});
});
