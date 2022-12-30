import * as admin from "firebase-admin";
import setupEnvironment from "./helpers/setupEnvironment";
import * as handlers from "../src/webflowHook/handler";
import {
  CollectionItemCreated,
  EcommInventoryChanged,
  EcommNewOrder,
  FormSubmissionPayload,
  SitePublishPayload,
  UserAccountAddedPayload,
} from "../src/webflowHook/types";

setupEnvironment();

admin.initializeApp({
  databaseURL: process.env.REALTIME_DATABASE_URL,
});

const db = admin.firestore();

jest.mock("../src/config", () => {
  return {
    storageBucketDefault: "test.appspot.com",
    userFirestorePath: "users",
    orderFirestorePath: "orders",
    inventoryFirestorePath: "inventory",
    collectionItemFirestorePath: "collection-items",
    formSubmissionFirstorePath: "form-submissions",
    sitePublishFirestorePath: "site-publish",
  };
});

describe("Test handlers", () => {
  const userId = "6287ec36a841b25637c663df";
  const orderId = "6287ec36a841b25637c66311";
  const inventoryItemId = "6287ec36a841b25637c66322";
  const collectionItemId = "6287ec36a841b25637c66333";
  const formSubmissionId = "6287ec36a841b25637c66344";
  const siteId = "6287ec36a841b25637c66355";

  beforeEach(async () => {
    await db.collection("users").doc(userId).delete();
    await db.collection("orders").doc(orderId).delete();
    await db.collection("inventory").doc(inventoryItemId).delete();
    await db.collection("form-submissions").doc(formSubmissionId).delete();
    await db.collection("site-publish").doc(collectionItemId).delete();
    await db.collection("collection-items").doc(collectionItemId).delete();
  });

  test("should create user document in firestore", async () => {
    await handlers.handleMembershipsUserAccountAdded(db, {
      _id: userId,
      createdOn: "2022-05-20T13:46:12.093Z",
      updatedOn: "2022-05-20T13:46:12.093Z",
      emailVerified: true,
      status: "verified",
      data: {
        "accept-privacy": false,
        "accept-communications": false,
        email: "Some.One@home.com",
        name: "Some One",
      },
    });
    const user = await db.collection("users").doc(userId).get();
    expect(user.exists).toBe(true);
    const userDoc = user.data() as UserAccountAddedPayload;
    expect(userDoc.data.name).toBe("Some One");
    expect(userDoc.data.email).toBe("Some.One@home.com");
  });

  test("should update user document in firestore", async () => {
    await handlers.handleMembershipsUserAccountUpdated(db, {
      _id: userId,
      createdOn: "2022-05-20T13:46:12.093Z",
      updatedOn: "2022-05-20T13:46:12.093Z",
      emailVerified: true,
      status: "verified",
      data: {
        "accept-privacy": false,
        "accept-communications": false,
        email: "Some.One@home.com",
        name: "Some One",
      },
    });
    const user = await db.collection("users").doc(userId).get();
    expect(user.exists).toBe(true);
    const userDoc = user.data() as UserAccountAddedPayload;
    expect(userDoc.data.name).toBe("Some One");
    expect(userDoc.data.email).toBe("Some.One@home.com");
  });

  test("should create order document in firestore", async () => {
    await handlers.handleEcommNewOrder(db, {
      orderId: orderId,
    });
    const order = await db.collection("orders").doc(orderId).get();
    expect(order.exists).toBe(true);
    const orderDoc = order.data() as EcommNewOrder;
    expect(orderDoc.orderId).toBe(orderId);
  });

  test("should update order document in firestore", async () => {
    await handlers.handleEcommOrderUpdated(db, {
      orderId: orderId,
    });
    const order = await db.collection("orders").doc(orderId).get();
    expect(order.exists).toBe(true);
    const orderDoc = order.data() as EcommNewOrder;
    expect(orderDoc.orderId).toBe(orderId);
  });

  test("should update inventory in firestore", async () => {
    await handlers.handleEcommInventoryChanged(db, {
      inventoryType: "finite",
      _id: inventoryItemId,
      quantity: 10,
    });
    const inventory = await db
      .collection("inventory")
      .doc(inventoryItemId)
      .get();
    expect(inventory.exists).toBe(true);
    const inventoryDoc = inventory.data() as EcommInventoryChanged;
    expect(inventoryDoc._id).toBe(inventoryItemId);
  });

  test("should create collection item in firestore", async () => {
    await handlers.handleCollectionItemCreated(db, {
      _cid: "test-id",
      _id: collectionItemId,
    });
    const collectionItem = await db
      .collection("collection-items")
      .doc(collectionItemId)
      .get();
    expect(collectionItem.exists).toBe(true);
    const collectionItemDoc = collectionItem.data() as CollectionItemCreated;
    expect(collectionItemDoc._id).toBe(collectionItemId);
  });

  test("should update collection item in firestore", async () => {
    await handlers.handleCollectionItemChanged(db, {
      _cid: "test-id",
      _id: collectionItemId,
    });
    const collectionItem = await db
      .collection("collection-items")
      .doc(collectionItemId)
      .get();
    expect(collectionItem.exists).toBe(true);
    const collectionItemDoc = collectionItem.data() as CollectionItemCreated;
    expect(collectionItemDoc._id).toBe(collectionItemId);
  });

  test("should delete collection item in firestore", async () => {
    // create firestore and storage
    await db
      .collection("collection-items")
      .doc(collectionItemId)
      .set({ _id: collectionItemId });

    await handlers.handleCollectionItemDeleted(db, {
      itemId: collectionItemId,
      deleted: 1,
    });
    const collectionItem = await db
      .collection("collection-items")
      .doc(collectionItemId)
      .get();
    expect(collectionItem.exists).toBe(false);
  });

  test("should delete collection item when item is unpublished", async () => {
    // create firestore and storage
    await db
      .collection("collection-items")
      .doc(collectionItemId)
      .set({ _id: collectionItemId });

    await handlers.handleCollectionItemUnpublished(db, {
      itemId: collectionItemId,
      deleted: 1,
    });
    const collectionItem = await db
      .collection("collection-items")
      .doc(collectionItemId)
      .get();
    expect(collectionItem.exists).toBe(false);
  });

  test("should create form submission in firestore", async () => {
    await handlers.handleFormSubmission(db, {
      _id: formSubmissionId,
    });
    const formSubmission = await db
      .collection("form-submissions")
      .doc(formSubmissionId)
      .get();
    expect(formSubmission.exists).toBe(true);
    const formSubmissionDoc = formSubmission.data() as FormSubmissionPayload;
    expect(formSubmissionDoc._id).toBe(formSubmissionId);
  });

  test("should update collection item in firestore", async () => {
    await handlers.handleSitePublish(db, {
      site: siteId,
    });
    const site = await db.collection("site-publish").doc(siteId).get();
    expect(site.exists).toBe(true);
    const siteDoc = site.data() as SitePublishPayload;
    expect(siteDoc.site).toBe(siteId);
  });
});
