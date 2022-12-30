import * as admin from "firebase-admin";
import setupEnvironment from "./helpers/setupEnvironment";
import * as handlers from "../src/webflowHook/handler";
import config from "../src/config";

setupEnvironment();

admin.initializeApp({
  databaseURL: process.env.REALTIME_DATABASE_URL,
});

const realtimeDb = admin.database();

jest.mock("../src/config", () => {
  return {
    storageBucketDefault: "test.appspot.com",
    userFirestorePath: "users",
    userDatabasePath: "users",
    userStoragePath: "users",
    orderFirestorePath: "orders",
    orderDatabasePath: "orders",
    orderStoragePath: "orders",
    inventoryFirestorePath: "inventory",
    inventoryDatabasePath: "inventory",
    inventoryStoragePath: "inventory",
    collectionItemFirestorePath: "collection-items",
    collectionItemDatabasePath: "collection-items",
    collectionItemStoragePath: "collection-items",
    formSubmissionFirstorePath: "form-submissions",
    formSubmissionStoragePath: "form-submissions",
    formSubmissionDatabasePath: "form-submissions",
    sitePublishFirestorePath: "site-publish",
    sitePublishStoragePath: "site-publish",
    sitePublishDatabasePath: "site-publish",
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
    await realtimeDb.ref(`${config.userDatabasePath}/${userId}`).remove();
    await realtimeDb.ref(`${config.orderDatabasePath}/${orderId}`).remove();
    await realtimeDb
      .ref(`${config.inventoryDatabasePath}/${inventoryItemId}`)
      .remove();
    await realtimeDb
      .ref(`${config.collectionItemDatabasePath}/${collectionItemId}`)
      .remove();
    await realtimeDb
      .ref(`${config.sitePublishDatabasePath}/${siteId}`)
      .remove();
    await realtimeDb
      .ref(`${config.formSubmissionDatabasePath}/${formSubmissionId}`)
      .remove();
  });

  test("should create user document in firestore", async () => {
    await handlers.handleMembershipsUserAccountAdded(realtimeDb, {
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
    const rtDoc = await realtimeDb
      .ref(`${config.userDatabasePath}/${userId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });

  test("should update user document in firestore", async () => {
    await handlers.handleMembershipsUserAccountUpdated(realtimeDb, {
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
    const rtDoc = await realtimeDb
      .ref(`${config.userDatabasePath}/${userId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });

  test("should create order document in firestore", async () => {
    await handlers.handleEcommNewOrder(realtimeDb, {
      orderId: orderId,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.orderDatabasePath}/${orderId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });

  test("should update order document in firestore", async () => {
    await handlers.handleEcommOrderUpdated(realtimeDb, {
      orderId: orderId,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.orderDatabasePath}/${orderId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });

  test("should update inventory in firestore", async () => {
    await handlers.handleEcommInventoryChanged(realtimeDb, {
      inventoryType: "finite",
      _id: inventoryItemId,
      quantity: 10,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.inventoryDatabasePath}/${inventoryItemId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });

  test("should create collection item in firestore", async () => {
    await handlers.handleCollectionItemCreated(realtimeDb, {
      _cid: "test-id",
      _id: collectionItemId,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.collectionItemDatabasePath}/${collectionItemId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });

  test("should update collection item in firestore", async () => {
    await handlers.handleCollectionItemChanged(realtimeDb, {
      _cid: "test-id",
      _id: collectionItemId,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.collectionItemDatabasePath}/${collectionItemId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });

  test("should delete collection item in firestore", async () => {
    // create firestore and storage
    await realtimeDb.ref(`collection-items/${collectionItemId}`).set({});
    await handlers.handleCollectionItemDeleted(realtimeDb, {
      itemId: collectionItemId,
      deleted: 1,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.collectionItemDatabasePath}/${collectionItemId}`)
      .get();
    expect(rtDoc.exists()).toBe(false);
  });

  test("should delete collection item when item is unpublished", async () => {
    // create firestore and storage
    await realtimeDb.ref(`collection-items/${collectionItemId}`).set({});
    await handlers.handleCollectionItemUnpublished(realtimeDb, {
      itemId: collectionItemId,
      deleted: 1,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.collectionItemDatabasePath}/${collectionItemId}`)
      .get();
    expect(rtDoc.exists()).toBe(false);
  });

  test("should create form submission in firestore", async () => {
    await handlers.handleFormSubmission(realtimeDb, {
      _id: formSubmissionId,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.formSubmissionDatabasePath}/${formSubmissionId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });

  test("should update collection item in firestore", async () => {
    await handlers.handleSitePublish(realtimeDb, {
      site: siteId,
    });
    const rtDoc = await realtimeDb
      .ref(`${config.sitePublishDatabasePath}/${siteId}`)
      .get();
    expect(rtDoc.exists()).toBe(true);
  });
});
