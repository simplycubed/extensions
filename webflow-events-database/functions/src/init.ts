import * as admin from "firebase-admin";
import config from "./config";
import { getDatabaseUrl } from "@simplycubed/webflow-utils";

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

export const database = admin.database();
