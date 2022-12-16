import { firestore } from "firebase-admin";
import config from "./config";

export interface UserAccountAddedPayload {
  _id: string;
  createdOn: string;
  updatedOn: string;
  emailVerified: boolean;
  status: string;
  invitedOn?: string;
  lastLogin?: string;
  data: {
    "accept-privacy": boolean;
    "accept-communications": boolean;
    email: string;
    name: string;
  };
}

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
