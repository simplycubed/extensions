"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOnMembershipsUserAccountAdded = void 0;
const config_1 = __importDefault(require("../config"));
/*
 * The onMembershipsUserAccountAdded function creates new webflow user in firestore and then
 * returns a success message.
 */
const handleOnMembershipsUserAccountAdded = async (db, payload) => {
  // TODO: convert time strings to timestamps?
  return db
    .collection(config_1.default.userCollectionPath)
    .doc(payload._id)
    .set(payload, { merge: true });
};
exports.handleOnMembershipsUserAccountAdded =
  handleOnMembershipsUserAccountAdded;
