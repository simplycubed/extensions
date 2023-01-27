import { database } from "firebase-admin";
import config from "../config";
import {
  CollectionItemChanged,
  CollectionItemCreated,
  CollectionItemDeleted,
  CollectionItemUnpublished,
  EcommInventoryChanged,
  EcommNewOrder,
  EcommOrderChanged,
  FormSubmissionPayload,
  SitePublishPayload,
  UserAccountAddedPayload,
  UserAccountUpdatedPayload,
} from "@simplycubed/webflow-utils";
import { getEventarc } from "firebase-admin/eventarc";

async function writeUserToDatabase(
  realtimeDb: database.Database,
  payload: UserAccountAddedPayload
) {
  return realtimeDb
    .ref(`${config.userDatabasePath}/${payload._id}`)
    .set(payload);
}

async function writeOrderToDatabase(
  realtimeDb: database.Database,
  payload: EcommNewOrder | EcommOrderChanged
) {
  return realtimeDb
    .ref(`${config.orderDatabasePath}/${payload.orderId}`)
    .set(payload);
}

async function writeInventoryToDatabase(
  realtimeDb: database.Database,
  payload: EcommInventoryChanged
) {
  return realtimeDb
    .ref(`${config.inventoryDatabasePath}/${payload._id}`)
    .set(payload);
}

async function writeCollectionItemToDatabase(
  realtimeDb: database.Database,
  payload: CollectionItemCreated
) {
  return realtimeDb
    .ref(`${config.collectionItemDatabasePath}/${payload._id}`)
    .set(payload);
}

async function deleteCollectionItemFromDatabase(
  realtimeDb: database.Database,
  _id: string
) {
  return realtimeDb.ref(`${config.collectionItemDatabasePath}/${_id}`).remove();
}

async function writeFormSubmissionToDatabase(
  realtimeDb: database.Database,
  payload: FormSubmissionPayload
) {
  return realtimeDb
    .ref(`${config.formSubmissionDatabasePath}/${payload._id}`)
    .set(payload);
}

async function writeSitePublishToDatabase(
  realtimeDb: database.Database,
  payload: SitePublishPayload
) {
  return realtimeDb
    .ref(`${config.sitePublishDatabasePath}/${payload.site}`)
    .set(payload);
}

/*
 * The handleMembershipsUserAccountAdded function creates new webflow user in firestore, storage and database.
 */
export const handleMembershipsUserAccountAdded = async (
  realtimeDb: database.Database,
  payload: UserAccountAddedPayload
) => {
  if (config.userDatabasePath) {
    await writeUserToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

/*
 * The onMembershipsUserAccountUpdated function creates new webflow user in firestore, storage and database.
 */
export const handleMembershipsUserAccountUpdated = async (
  realtimeDb: database.Database,
  payload: UserAccountUpdatedPayload
) => {
  if (config.userDatabasePath) {
    await writeUserToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleEcommNewOrder function creates new webflow order in firestore, storage and database.
 */
export const handleEcommNewOrder = async (
  realtimeDb: database.Database,
  payload: EcommNewOrder
) => {
  if (config.orderDatabasePath) {
    await writeOrderToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleEcommOrderUpdated function creates new webflow order in firestore, storage and database.
 */
export const handleEcommOrderUpdated = async (
  realtimeDb: database.Database,
  payload: EcommNewOrder
) => {
  if (config.orderDatabasePath) {
    await writeOrderToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleEcommInventoryChanged function creates new webflow order in firestore, storage and database.
 */
export const handleEcommInventoryChanged = async (
  realtimeDb: database.Database,
  payload: EcommInventoryChanged
) => {
  if (config.inventoryDatabasePath) {
    await writeInventoryToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

export const handleCollectionItemCreated = async (
  realtimeDb: database.Database,
  payload: CollectionItemCreated
) => {
  if (config.collectionItemDatabasePath) {
    await writeCollectionItemToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleCollectionItemChanged function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemChanged = async (
  realtimeDb: database.Database,
  payload: CollectionItemChanged
) => {
  if (config.collectionItemDatabasePath) {
    await writeCollectionItemToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleCollectionItemDeleted function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemDeleted = async (
  realtimeDb: database.Database,
  payload: CollectionItemDeleted
) => {
  if (config.collectionItemDatabasePath) {
    await deleteCollectionItemFromDatabase(realtimeDb, payload.itemId);
    await publishEvent(payload);
  }
};

/*
 * The handleCollectionItemUnpublished function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemUnpublished = async (
  realtimeDb: database.Database,
  payload: CollectionItemUnpublished
) => {
  if (config.collectionItemDatabasePath) {
    await deleteCollectionItemFromDatabase(realtimeDb, payload.itemId);
    await publishEvent(payload);
  }
};

/*
 * The handleFormSubmission function creates new form submission document in firestore, storage and database.
 */
export const handleFormSubmission = async (
  realtimeDb: database.Database,
  payload: FormSubmissionPayload
) => {
  if (config.formSubmissionDatabasePath) {
    await writeFormSubmissionToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleFormSubmission function creates new form submission document in firestore, storage and database.
 */
export const handleSitePublish = async (
  realtimeDb: database.Database,
  payload: SitePublishPayload
) => {
  if (config.sitePublishDatabasePath) {
    await writeSitePublishToDatabase(realtimeDb, payload);
    await publishEvent(payload);
  }
};

const publishEvent = async (payload: any) => {
  await getEventarc().channel().publish({
    type: "firebase.extensions.webflow-events-database.v1.received",
    subject: "Payload Received",
    data: payload,
  });
};
