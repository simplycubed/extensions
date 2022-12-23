import { firestore, storage } from "firebase-admin";
import config from "../config";
import { UserAccountAddedPayload } from "./types";

/*
 * The onMembershipsUserAccountAdded function creates new webflow user in firestore and then
 * returns a success message.
 */
export const handleMembershipsUserAccountAdded = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: UserAccountAddedPayload
) => {
  await db
    .collection(config.firestoreUserCollectionName)
    .doc(payload._id)
    .set(payload, { merge: true });

  if (config.storageUserPath) {
    // sync to storage
    const fileContents = JSON.stringify(payload);
    await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.storageUserPath}/${payload._id}.json`)
      .save(fileContents, { validation: false });
  }
};
