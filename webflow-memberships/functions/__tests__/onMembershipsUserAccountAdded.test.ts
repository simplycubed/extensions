import * as admin from "firebase-admin";
import setupEnvironment from "../__tests__/helpers/setupEnvironment";
import { handleOnMembershipsUserAccountAdded } from "../src/webflowHook/handler";
import { UserAccountAddedPayload } from "../src/webflowHook/types";

setupEnvironment();

admin.initializeApp();
const db = admin.firestore();

describe("Test onMembershipsUserAccountAdded", () => {
  // TODO: add clean up functions
  test("Should create user document is firestore", async () => {
    const userId = "6287ec36a841b25637c663df";
    await handleOnMembershipsUserAccountAdded(db, {
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
});
