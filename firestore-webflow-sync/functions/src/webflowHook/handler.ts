import { firestore } from "firebase-admin";
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
  TriggerType,
  UserAccountAddedPayload,
  UserAccountUpdatedPayload,
} from "@simplycubed/webflow-utils";
import { getEventarc } from "firebase-admin/eventarc";

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

/*
 * The handleMembershipsUserAccountAdded function creates new webflow user in firestore, storage and database.
 */
export const handleMembershipsUserAccountAdded = async (
  db: firestore.Firestore,
  payload: UserAccountAddedPayload
) => {
  if (config.userFirestorePath) {
    // sync to firestore
    await writeUserToFirestore(db, payload);
    await publishEvent(payload, TriggerType.memberships_user_account_added);
  }
};

/*
 * The onMembershipsUserAccountUpdated function creates new webflow user in firestore, storage and database.
 */
export const handleMembershipsUserAccountUpdated = async (
  db: firestore.Firestore,
  payload: UserAccountUpdatedPayload
) => {
  if (config.userFirestorePath) {
    // sync to firestore
    await writeUserToFirestore(db, payload);
    await publishEvent(payload, TriggerType.memberships_user_account_updated);
  }
};

/*
 * The handleEcommNewOrder function creates new webflow order in firestore, storage and database.
 */
export const handleEcommNewOrder = async (
  db: firestore.Firestore,
  payload: EcommNewOrder
) => {
  if (config.userFirestorePath) {
    // sync to firestore
    await writeOrderToFirestore(db, payload);
    await publishEvent(payload, TriggerType.ecomm_new_order);
  }
};

/*
 * The handleEcommOrderUpdated function creates new webflow order in firestore, storage and database.
 */
export const handleEcommOrderUpdated = async (
  db: firestore.Firestore,
  payload: EcommNewOrder
) => {
  if (config.orderFirestorePath) {
    // sync to firestore
    await writeOrderToFirestore(db, payload);
    await publishEvent(payload, TriggerType.ecomm_order_changed);
  }
};

/*
 * The handleEcommInventoryChanged function creates new webflow order in firestore, storage and database.
 */
export const handleEcommInventoryChanged = async (
  db: firestore.Firestore,
  payload: EcommInventoryChanged
) => {
  if (config.inventoryFirestorePath) {
    // sync to firestore
    await writeInventoryToFirestore(db, payload);
    await publishEvent(payload, TriggerType.ecomm_inventory_changed);
  }
};

export const handleCollectionItemCreated = async (
  db: firestore.Firestore,
  payload: CollectionItemCreated
) => {
  if (config.collectionItemFirestorePath) {
    // sync to firestore
    await writeCollectionItemToFirestore(db, payload);
    await publishEvent(payload, TriggerType.collection_item_created);
  }
};

/*
 * The handleCollectionItemChanged function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemChanged = async (
  db: firestore.Firestore,
  payload: CollectionItemChanged
) => {
  if (config.collectionItemFirestorePath) {
    // sync to firestore
    await writeCollectionItemToFirestore(db, payload);
    await publishEvent(payload, TriggerType.collection_item_changed);
  }
};

/*
 * The handleCollectionItemDeleted function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemDeleted = async (
  db: firestore.Firestore,
  payload: CollectionItemDeleted
) => {
  if (config.collectionItemFirestorePath) {
    // delete from firestore
    await deleteCollectionItemFromFirestore(db, payload.itemId);
    await publishEvent(payload, TriggerType.collection_item_deleted);
  }
};

/*
 * The handleCollectionItemUnpublished function creates new webflow order in firestore, storage and database.
 */
export const handleCollectionItemUnpublished = async (
  db: firestore.Firestore,
  payload: CollectionItemUnpublished
) => {
  if (config.collectionItemFirestorePath) {
    // delete from firestore
    await deleteCollectionItemFromFirestore(db, payload.itemId);
    await publishEvent(payload, TriggerType.collection_item_unpublished);
  }
};

/*
 * The handleFormSubmission function creates new form submission document in firestore, storage and database.
 */
export const handleFormSubmission = async (
  db: firestore.Firestore,
  payload: FormSubmissionPayload
) => {
  if (config.formSubmissionFirstorePath) {
    await writeFormSubmissionToFirestore(db, payload);
    await publishEvent(payload, TriggerType.form_submission);
  }
};

/*
 * The handleFormSubmission function creates new form submission document in firestore, storage and database.
 */
export const handleSitePublish = async (
  db: firestore.Firestore,
  payload: SitePublishPayload
) => {
  if (config.sitePublishFirestorePath) {
    await writeSitePublishToFirestore(db, payload);
    await publishEvent(payload, TriggerType.site_publish);
  }
};

const publishEvent = async (payload: any, type: TriggerType) => {
  await getEventarc().channel().publish({
    type: "simplycubed.firestore-webflow-sync.v1.received",
    subject: "Payload Received",
    data: {
      data: payload,
      type,
    },
  });
};
