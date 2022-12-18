import { firestore } from "firebase-admin";
import config from "../config";
import { UserAccountAddedPayload } from "./types";

/*
 * The onMembershipsUserAccountAdded function creates new webflow user in firestore and then
 * returns a success message.
 */
export const handleOnMembershipsUserAccountAdded = async (
  db: firestore.Firestore,
  payload: UserAccountAddedPayload
) => {
  // TODO: convert time strings to timestamps?
  return db
    .collection(config.userCollectionPath)
    .doc(payload._id)
    .set(payload, { merge: true });
};
