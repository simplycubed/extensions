import { storage } from "firebase-admin";
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

async function writeInventoryToStorage(
  storage: storage.Storage,
  payload: EcommInventoryChanged
) {
  const fileContents = JSON.stringify(payload);
  return storage
    .bucket(config.storageBucketDefault)
    .file(`${config.inventoryStoragePath}/${payload._id}.json`)
    .save(fileContents, { validation: false });
}

async function writeUserToStorage(
  storage: storage.Storage,
  payload: UserAccountAddedPayload
) {
  const fileContents = JSON.stringify(payload);
  return storage
    .bucket(config.storageBucketDefault)
    .file(`${config.userStoragePath}/${payload._id}.json`)
    .save(fileContents, { validation: false });
}

async function writeOrderToStorage(
  storage: storage.Storage,
  payload: EcommNewOrder | EcommOrderChanged
) {
  const fileContents = JSON.stringify(payload);
  return storage
    .bucket(config.storageBucketDefault)
    .file(`${config.orderStoragePath}/${payload.orderId}.json`)
    .save(fileContents, { validation: false });
}

async function writeCollectionItemToStorage(
  storage: storage.Storage,
  payload: CollectionItemCreated | CollectionItemChanged
) {
  const fileContents = JSON.stringify(payload);
  return storage
    .bucket(config.storageBucketDefault)
    .file(`${config.collectionItemStoragePath}/${payload._id}.json`)
    .save(fileContents, { validation: false });
}

async function writeFormSubmissionToStorage(
  storage: storage.Storage,
  payload: FormSubmissionPayload
) {
  const fileContents = JSON.stringify(payload);
  return storage
    .bucket(config.storageBucketDefault)
    .file(`${config.formSubmissionStoragePath}/${payload._id}.json`)
    .save(fileContents, { validation: false });
}

async function writeSitePublishToStorage(
  storage: storage.Storage,
  payload: SitePublishPayload
) {
  const fileContents = JSON.stringify(payload);
  return storage
    .bucket(config.storageBucketDefault)
    .file(`${config.sitePublishStoragePath}/${payload.site}.json`)
    .save(fileContents, { validation: false });
}

async function deleteCollectionItemFromStorage(
  storage: storage.Storage,
  _id: string
) {
  return storage
    .bucket(config.storageBucketDefault)
    .file(`${config.collectionItemStoragePath}/${_id}.json`)
    .delete();
}

/*
 * The handleMembershipsUserAccountAdded function creates new webflow user in firestore, storage and database.
 */
export const handleMembershipsUserAccountAdded = async (
  storage: storage.Storage,
  payload: UserAccountAddedPayload
) => {
  if (config.userStoragePath) {
    // sync to storage
    await writeUserToStorage(storage, payload);
    await publishEvent(payload);
  }
};

/*
 * The onMembershipsUserAccountUpdated function creates new webflow user in firestore, storage and database.
 */
export const handleMembershipsUserAccountUpdated = async (
  storage: storage.Storage,
  payload: UserAccountUpdatedPayload
) => {
  if (config.userStoragePath) {
    // sync to storage
    await writeUserToStorage(storage, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleEcommNewOrder function creates new webflow order in firestore, storage and database.
 */
export const handleEcommNewOrder = async (
  storage: storage.Storage,
  payload: EcommNewOrder
) => {
  if (config.userStoragePath) {
    // sync to storage
    await writeOrderToStorage(storage, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleEcommOrderUpdated function creates new webflow order in firestore, storage and database.
 */
export const handleEcommOrderUpdated = async (
  storage: storage.Storage,
  payload: EcommNewOrder
) => {
  if (config.orderStoragePath) {
    // sync to storage
    await writeOrderToStorage(storage, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleEcommInventoryChanged function creates new webflow order in firestore, storage and database.
 */
export const handleEcommInventoryChanged = async (
  storage: storage.Storage,
  payload: EcommInventoryChanged
) => {
  if (config.inventoryStoragePath) {
    // sync to storage
    await writeInventoryToStorage(storage, payload);
    await publishEvent(payload);
  }
};

export const handleCollectionItemCreated = async (
  storage: storage.Storage,
  payload: CollectionItemCreated
) => {
  if (config.collectionItemStoragePath) {
    // sync to storage
    await writeCollectionItemToStorage(storage, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleCollectionItemChanged function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemChanged = async (
  storage: storage.Storage,
  payload: CollectionItemChanged
) => {
  if (config.collectionItemStoragePath) {
    // sync to storage
    await writeCollectionItemToStorage(storage, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleCollectionItemDeleted function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemDeleted = async (
  storage: storage.Storage,
  payload: CollectionItemDeleted
) => {
  if (config.collectionItemStoragePath) {
    // delete from storage
    await deleteCollectionItemFromStorage(storage, payload.itemId);
    await publishEvent(payload);
  }
};

/*
 * The handleCollectionItemUnpublished function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemUnpublished = async (
  storage: storage.Storage,
  payload: CollectionItemUnpublished
) => {
  if (config.collectionItemStoragePath) {
    // delete from storage
    await deleteCollectionItemFromStorage(storage, payload.itemId);
    await publishEvent(payload);
  }
};

/*
 * The handleFormSubmission function creates new form submission document in firestore, storage and database.
 */
export const handleFormSubmission = async (
  storage: storage.Storage,
  payload: FormSubmissionPayload
) => {
  if (config.formSubmissionStoragePath) {
    await writeFormSubmissionToStorage(storage, payload);
    await publishEvent(payload);
  }
};

/*
 * The handleFormSubmission function creates new form submission document in firestore, storage and database.
 */
export const handleSitePublish = async (
  storage: storage.Storage,
  payload: SitePublishPayload
) => {
  if (config.sitePublishStoragePath) {
    await writeSitePublishToStorage(storage, payload);
    await publishEvent(payload);
  }
};

const publishEvent = async (payload: any) => {
  await getEventarc().channel().publish({
    type: "firebase.extensions.storage-webflow-sync.v1.received",
    subject: "Payload Received",
    data: payload,
  });
};
