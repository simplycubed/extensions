import { firestore, storage } from "firebase-admin";
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
} from "./types";

async function writeUserToFirestore(
  db: firestore.Firestore,
  payload: UserAccountAddedPayload
) {
  return db
    .collection(config.userFirestorePath)
    .doc(payload._id)
    .set(payload, { merge: true });
}

async function writeOrderToFirestore(
  db: firestore.Firestore,
  payload: EcommNewOrder | EcommOrderChanged
) {
  return db
    .collection(config.orderFirestorePath)
    .doc(payload.orderId)
    .set(payload, { merge: true });
}

async function writeInventoryToFirestore(
  db: firestore.Firestore,
  payload: EcommInventoryChanged
) {
  return db
    .collection(config.inventoryFirestorePath)
    .doc(payload._id)
    .set(payload, { merge: true });
}

async function writeCollectionItemToFirestore(
  db: firestore.Firestore,
  payload: CollectionItemCreated
) {
  return db
    .collection(config.collectionItemFirestorePath)
    .doc(payload._id)
    .set(payload, { merge: true });
}

async function writeFormSubmissionToFirestore(
  db: firestore.Firestore,
  payload: FormSubmissionPayload
) {
  return db
    .collection(config.formSubmissionFirstorePath)
    .doc(payload._id)
    .set(payload, { merge: true });
}

async function writeSitePublishToFirestore(
  db: firestore.Firestore,
  payload: SitePublishPayload
) {
  return db
    .collection(config.sitePublishFirestorePath)
    .doc(payload.site)
    .set(payload, { merge: true });
}

async function deleteCollectionItemFromFirestore(
  db: firestore.Firestore,
  _id: string
) {
  return db.collection(config.collectionItemFirestorePath).doc(_id).delete();
}

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
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: UserAccountAddedPayload
) => {
  if (config.userFirestorePath) {
    // sync to firestore
    await writeUserToFirestore(db, payload);
  }

  if (config.userStoragePath) {
    // sync to storage
    await writeUserToStorage(storage, payload);
  }
};

/*
 * The onMembershipsUserAccountUpdated function creates new webflow user in firestore, storage and database.
 */
export const handleMembershipsUserAccountUpdated = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: UserAccountUpdatedPayload
) => {
  if (config.userFirestorePath) {
    // sync to firestore
    await writeUserToFirestore(db, payload);
  }

  if (config.userStoragePath) {
    // sync to storage
    await writeUserToStorage(storage, payload);
  }
};

/*
 * The handleEcommNewOrder function creates new webflow order in firestore, storage and database.
 */
export const handleEcommNewOrder = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: EcommNewOrder
) => {
  if (config.userFirestorePath) {
    // sync to firestore
    await writeOrderToFirestore(db, payload);
  }

  if (config.userStoragePath) {
    // sync to storage
    await writeOrderToStorage(storage, payload);
  }
};

/*
 * The handleEcommOrderUpdated function creates new webflow order in firestore, storage and database.
 */
export const handleEcommOrderUpdated = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: EcommNewOrder
) => {
  if (config.orderFirestorePath) {
    // sync to firestore
    await writeOrderToFirestore(db, payload);
  }

  if (config.orderStoragePath) {
    // sync to storage
    await writeOrderToStorage(storage, payload);
  }
};

/*
 * The handleEcommInventoryChanged function creates new webflow order in firestore, storage and database.
 */
export const handleEcommInventoryChanged = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: EcommInventoryChanged
) => {
  if (config.inventoryFirestorePath) {
    // sync to firestore
    await writeInventoryToFirestore(db, payload);
  }

  if (config.inventoryStoragePath) {
    // sync to storage
    await writeInventoryToStorage(storage, payload);
  }
};

export const handleCollectionItemCreated = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: CollectionItemCreated
) => {
  if (config.collectionItemFirestorePath) {
    // sync to firestore
    await writeCollectionItemToFirestore(db, payload);
  }

  if (config.collectionItemStoragePath) {
    // sync to storage
    await writeCollectionItemToStorage(storage, payload);
  }
};

/*
 * The handleCollectionItemChanged function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemChanged = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: CollectionItemChanged
) => {
  if (config.collectionItemFirestorePath) {
    // sync to firestore
    await writeCollectionItemToFirestore(db, payload);
  }

  if (config.collectionItemStoragePath) {
    // sync to storage
    await writeCollectionItemToStorage(storage, payload);
  }
};

/*
 * The handleCollectionItemDeleted function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemDeleted = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: CollectionItemDeleted
) => {
  if (config.collectionItemFirestorePath) {
    // delete from firestore
    await deleteCollectionItemFromFirestore(db, payload.itemId);
  }

  if (config.collectionItemStoragePath) {
    // delete from storage
    await deleteCollectionItemFromStorage(storage, payload.itemId);
  }
};

/*
 * The handleCollectionItemUnpublished function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemUnpublished = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: CollectionItemUnpublished
) => {
  if (config.collectionItemFirestorePath) {
    // delete from firestore
    await deleteCollectionItemFromFirestore(db, payload.itemId);
  }

  if (config.collectionItemStoragePath) {
    // delete from storage
    await deleteCollectionItemFromStorage(storage, payload.itemId);
  }
};

/*
 * The handleFormSubmission function creates new form submission document in firestore, storage and database.
 */
export const handleFormSubmission = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: FormSubmissionPayload
) => {
  if (config.formSubmissionFirstorePath) {
    await writeFormSubmissionToFirestore(db, payload);
  }

  if (config.formSubmissionStoragePath) {
    await writeFormSubmissionToStorage(storage, payload);
  }
};

/*
 * The handleFormSubmission function creates new form submission document in firestore, storage and database.
 */
export const handleSitePublish = async (
  db: firestore.Firestore,
  storage: storage.Storage,
  payload: SitePublishPayload
) => {
  if (config.sitePublishFirestorePath) {
    await writeSitePublishToFirestore(db, payload);
  }

  if (config.sitePublishStoragePath) {
    await writeSitePublishToStorage(storage, payload);
  }
};
