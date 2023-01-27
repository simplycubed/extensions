import * as admin from "firebase-admin";
import setupEnvironment from "./helpers/setupEnvironment";
import * as handlers from "../src/webflowHook/handler";
import config from "../src/config";

setupEnvironment();

admin.initializeApp({
  databaseURL: process.env.REALTIME_DATABASE_URL,
});

const storage = admin.storage();

jest.mock("firebase-admin/eventarc", () => {
  return {
    getEventarc: () => ({
      channel: () => ({
        publish: jest.fn(),
      }),
    }),
  };
});

jest.mock("../src/config", () => {
  return {
    storageBucketDefault: "test.appspot.com",
    userStoragePath: "users",
    orderStoragePath: "orders",
    inventoryStoragePath: "inventory",
    collectionItemStoragePath: "collection-items",
    formSubmissionStoragePath: "form-submissions",
    sitePublishStoragePath: "site-publish",
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
    const [formSubmissionExists] = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.formSubmissionStoragePath}/${formSubmissionId}.json`)
      .exists();
    if (formSubmissionExists) {
      await storage
        .bucket(config.storageBucketDefault)
        .file(`${config.formSubmissionStoragePath}/${formSubmissionId}.json`)
        .delete();
    }
    const [sitePublishExists] = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.sitePublishStoragePath}/${siteId}.json`)
      .exists();
    if (sitePublishExists) {
      await storage
        .bucket(config.storageBucketDefault)
        .file(`${config.sitePublishStoragePath}/${siteId}.json`)
        .delete();
    }
  });

  test("should create user document in firestore", async () => {
    await handlers.handleMembershipsUserAccountAdded(storage, {
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
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.userStoragePath}/${userId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update user document in firestore", async () => {
    await handlers.handleMembershipsUserAccountUpdated(storage, {
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
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.userStoragePath}/${userId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should create order document in firestore", async () => {
    await handlers.handleEcommNewOrder(storage, {
      orderId: orderId,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.orderStoragePath}/${orderId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update order document in firestore", async () => {
    await handlers.handleEcommOrderUpdated(storage, {
      orderId: orderId,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.orderStoragePath}/${orderId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update inventory in firestore", async () => {
    await handlers.handleEcommInventoryChanged(storage, {
      inventoryType: "finite",
      _id: inventoryItemId,
      quantity: 10,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.inventoryStoragePath}/${inventoryItemId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should create collection item in firestore", async () => {
    await handlers.handleCollectionItemCreated(storage, {
      _cid: "test-id",
      _id: collectionItemId,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update collection item in firestore", async () => {
    await handlers.handleCollectionItemChanged(storage, {
      _cid: "test-id",
      _id: collectionItemId,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should delete collection item in firestore", async () => {
    // create firestore and storage
    await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .save("test-file-contents", { validation: false });

    await handlers.handleCollectionItemDeleted(storage, {
      itemId: collectionItemId,
      deleted: 1,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    expect(fileExists).toEqual([false]);
  });

  test("should delete collection item when item is unpublished", async () => {
    // create firestore and storage
    await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .save("test-file-contents", { validation: false });

    await handlers.handleCollectionItemUnpublished(storage, {
      itemId: collectionItemId,
      deleted: 1,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.collectionItemStoragePath}/${collectionItemId}.json`)
      .exists();
    expect(fileExists).toEqual([false]);
  });

  test("should create form submission in firestore", async () => {
    await handlers.handleFormSubmission(storage, {
      _id: formSubmissionId,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.formSubmissionStoragePath}/${formSubmissionId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });

  test("should update collection item in firestore", async () => {
    await handlers.handleSitePublish(storage, {
      site: siteId,
    });
    const fileExists = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.sitePublishStoragePath}/${siteId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });
});
