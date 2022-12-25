import * as admin from "firebase-admin";
import setupEnvironment from "./helpers/setupEnvironment";
import * as handlers from "../src/webflowHook/handler";
import {
  CollectionItemCreated,
  EcommInventoryChanged,
  EcommNewOrder,
  UserAccountAddedPayload,
} from "../src/webflowHook/types";
import config from "../src/config";

setupEnvironment();

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

jest.mock("../src/config", () => {
  return {
    storageBucketDefault: "test.appspot.com",
    userFirestorePath: "users",
    userStoragePath: "users",
    orderFirestorePath: "orders",
    orderStoragePath: "orders",
    inventoryFirestorePath: "inventory",
    inventoryStoragePath: "inventory",
    collectionItemFirestorePath: "collection-items",
    collectionItemStoragePath: "collection-items",
  };
});

describe("Test handlers", () => {
  const userId = "6287ec36a841b25637c663df";
  const orderId = "6287ec36a841b25637c66311";
  const inventoryItemId = "6287ec36a841b25637c66322";
  const collectionItemId = "6287ec36a841b25637c66333";

  beforeEach(async () => {
    await db.collection("users").doc(userId).delete();
    await db.collection("orders").doc(orderId).delete();
    await db.collection("inventory").doc(inventoryItemId).delete();
    await db.collection("collection-items").doc(collectionItemId).delete();
    const [fileExists] = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.userStoragePath}/${userId}.json`)
      .exists();
    if (fileExists) {
      await storage
        .bucket(config.storageBucketDefault)
        .file(`${config.userStoragePath}/${userId}.json`)
        .delete();
    }
    const [orderFileExists] = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.orderStoragePath}/${orderId}.json`)
      .exists();
    if (orderFileExists) {
      await storage
        .bucket(config.storageBucketDefault)
        .file(`${config.orderStoragePath}/${orderId}.json`)
        .delete();
    }
    const [inventoryFileExists] = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.inventoryStoragePath}/${orderId}.json`)
      .exists();
    if (inventoryFileExists) {
      await storage
        .bucket(config.storageBucketDefault)
        .file(`${config.inventoryStoragePath}/${orderId}.json`)
        .delete();
    }
    const [collectionItemExists] = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    if (collectionItemExists) {
      await storage
        .bucket(config.storageBucketDefault)
        .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
        .delete();
    }
  });
  test("should create user document in firestore", async () => {
    await handlers.handleMembershipsUserAccountAdded(db, storage, {
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
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.userStoragePath}/${userId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update user document in firestore", async () => {
    await handlers.handleMembershipsUserAccountUpdated(db, storage, {
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
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.userStoragePath}/${userId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should create order document in firestore", async () => {
    await handlers.handleEcommNewOrder(db, storage, {
      orderId: orderId,
    });
    const order = await db.collection("orders").doc(orderId).get();
    expect(order.exists).toBe(true);
    const orderDoc = order.data() as EcommNewOrder;
    expect(orderDoc.orderId).toBe(orderId);
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.orderStoragePath}/${orderId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update order document in firestore", async () => {
    await handlers.handleEcommOrderUpdated(db, storage, {
      orderId: orderId,
    });
    const order = await db.collection("orders").doc(orderId).get();
    expect(order.exists).toBe(true);
    const orderDoc = order.data() as EcommNewOrder;
    expect(orderDoc.orderId).toBe(orderId);
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.orderStoragePath}/${orderId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update inventory in firestore", async () => {
    await handlers.handleEcommInventoryChanged(db, storage, {
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
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.inventoryStoragePath}/${inventoryItemId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should create collection item in firestore", async () => {
    await handlers.handleCollectionItemCreated(db, storage, {
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
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update collection item in firestore", async () => {
    await handlers.handleCollectionItemChanged(db, storage, {
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
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should delete collection item in firestore", async () => {
    // create firestore and storage
    await db
      .collection("collection-items")
      .doc(collectionItemId)
      .set({ _id: collectionItemId });
    await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .save("test-file-contents", { validation: false });

    await handlers.handleCollectionItemDeleted(db, storage, {
      itemId: collectionItemId,
      deleted: 1,
    });
    const collectionItem = await db
      .collection("collection-items")
      .doc(collectionItemId)
      .get();
    expect(collectionItem.exists).toBe(false);
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    expect(fileExists).toEqual([false]);
  });

  test("should delete collection item when item is unpublished", async () => {
    // create firestore and storage
    await db
      .collection("collection-items")
      .doc(collectionItemId)
      .set({ _id: collectionItemId });
    await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .save("test-file-contents", { validation: false });

    await handlers.handleCollectionItemUnpublished(db, storage, {
      itemId: collectionItemId,
      deleted: 1,
    });
    const collectionItem = await db
      .collection("collection-items")
      .doc(collectionItemId)
      .get();
    expect(collectionItem.exists).toBe(false);
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    expect(fileExists).toEqual([false]);
  });
});
