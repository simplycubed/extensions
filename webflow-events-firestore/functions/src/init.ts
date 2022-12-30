import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const firstoreDb = admin.firestore();
