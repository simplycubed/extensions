import * as admin from "firebase-admin";
import config from "./config";
import { getDatabaseUrl } from "./helpers";
import * as logs from "./logger";

// Helper function for selecting correct domain adrress
export const databaseURL = getDatabaseUrl(
  config.selectedDatabaseInstance,
  config.selectedDatabaseLocation
);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL,
});

export const firstoreDb = admin.firestore();
export const database = admin.database();
export const storage = admin.storage();
