"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMembershipsUserAccountAdded = void 0;
const config_1 = __importDefault(require("../config"));
/*
 * The onMembershipsUserAccountAdded function creates new webflow user in firestore and then
 * returns a success message.
 */
const handleMembershipsUserAccountAdded = async (db, storage, payload) => {
  await db
    .collection(config_1.default.userCollectionPath)
    .doc(payload._id)
    .set(payload, { merge: true });
  if (config_1.default.storageUserPath) {
    // sync to storage
    const fileContents = JSON.stringify(payload);
    await storage
      .bucket(config_1.default.storageBucketDefault)
      .file(`${config_1.default.storageUserPath}/${payload._id}.json`)
      .save(fileContents, { validation: false });
  }
};
exports.handleMembershipsUserAccountAdded = handleMembershipsUserAccountAdded;
