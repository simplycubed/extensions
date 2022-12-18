import * as admin from "firebase-admin";
import setupEnvironment from "./helpers/setupEnvironment";
import { handleMembershipsUserAccountAdded } from "../src/webflowHook/handler";
import { UserAccountAddedPayload } from "../src/webflowHook/types";
import config from "../src/config";

setupEnvironment();

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

jest.mock("../src/config", () => {
  return {
    storageBucketDefault: "test.appspot.com",
    userCollectionPath: "users",
    storageUserPath: "users",
  };
});

describe("Test membershipsUserAccountAdded", () => {
  const userId = "6287ec36a841b25637c663df";

  beforeEach(async () => {
    await db.collection("users").doc(userId).delete();
    const [fileExists] = await storage
      .bucket(config.storageBucketDefault)
      .file(`${config.storageUserPath}/${userId}.json`)
      .exists();
    if (fileExists) {
      await storage
        .bucket(config.storageBucketDefault)
        .file(`${config.storageUserPath}/${userId}.json`)
        .delete();
    }
  });
  test("Should create user document is firestore", async () => {
    await handleMembershipsUserAccountAdded(db, storage, {
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
      .file(`${config.storageUserPath}/${userId}.json`)
      .exists();
    expect(fileExists).toEqual([true]);
  });
});
