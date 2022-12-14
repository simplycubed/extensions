"use strict";
/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearData = exports.handleSearch = exports.handleDeletion = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const functions = __importStar(require("firebase-functions"));
const firebase_tools = __importStar(require("firebase-tools"));
const helpers_1 = require("./helpers");
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const eventarc_1 = require("firebase-admin/eventarc");
const config_1 = __importDefault(require("./config"));
const logs = __importStar(require("./logs"));
const search_1 = require("./search");
const runCustomSearchFunction_1 = require("./runCustomSearchFunction");
const runBatchPubSubDeletions_1 = require("./runBatchPubSubDeletions");
// Helper function for selecting correct domain adrress
const databaseURL = (0, helpers_1.getDatabaseUrl)(
  config_1.default.selectedDatabaseInstance,
  config_1.default.selectedDatabaseLocation
);
// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL,
});
const db = admin.firestore();
/** Setup EventArc Channels */
const eventChannel =
  process.env.EVENTARC_CHANNEL &&
  (0, eventarc_1.getEventarc)().channel(process.env.EVENTARC_CHANNEL, {
    allowedEventTypes: process.env.EXT_SELECTED_EVENTS,
  });
logs.init();
exports.handleDeletion = functions.pubsub
  .topic(config_1.default.deletionTopic)
  .onPublish(async (message) => {
    const data = JSON.parse(
      Buffer.from(message.data, "base64").toString("utf8")
    );
    const paths = data.paths;
    const uid = data.uid;
    const batchArray = [];
    (0, lodash_chunk_1.default)(paths, 450).forEach((chunk) => {
      const batch = db.batch();
      /** Loop through each path query */
      for (const path of chunk) {
        const docRef = db.doc(path);
        batch.delete(docRef);
      }
      batchArray.push(batch);
    });
    await Promise.all(batchArray.map((batch) => batch.commit()));
    if (eventChannel) {
      await eventChannel.publish({
        type: `firebase.extensions.delete-user-data.v1.firestore`,
        data: {
          uid,
          documentPaths: paths,
        },
      });
    }
  });
exports.handleSearch = functions.pubsub
  .topic(config_1.default.discoveryTopic)
  .onPublish(async (message) => {
    const data = JSON.parse(
      Buffer.from(message.data, "base64").toString("utf8")
    );
    const path = data.path;
    const depth = data.depth;
    const nextDepth = data.depth + 1;
    const uid = data.uid;
    // Create a collection reference from the path
    const collection = db.collection(path);
    if (depth <= config_1.default.searchDepth) {
      // If the collection ID is the same as the UID, delete the entire collection and sub-collections
      if (collection.id === uid) {
        await firebase_tools.firestore.delete(path, {
          project: process.env.PROJECT_ID,
          recursive: true,
          yes: true, // auto-confirmation
        });
        if (eventChannel) {
          /** Publish event to EventArc */
          await eventChannel.publish({
            type: `firebase.extensions.delete-user-data.v1.firestore`,
            data: {
              uid,
              collectionPath: collection.path,
            },
          });
        }
        return;
      }
      const documentReferences = await collection.listDocuments();
      const documentReferencesToSearch = [];
      const pathsToDelete = [];
      await Promise.all(
        documentReferences.map(async (reference) => {
          // Start a sub-collection search on each document.
          if (nextDepth <= config_1.default.searchDepth) {
            await (0, search_1.search)(uid, nextDepth, reference);
          }
          // If the ID of the document is the same as the UID, add it to delete list.
          if (reference.id === uid) {
            pathsToDelete.push(reference.path);
          }
          // If the user has search fields, all the document to the list of documents to search.
          else if (config_1.default.searchFields) {
            documentReferencesToSearch.push(reference);
          }
        })
      );
      // Get any documents which need searching, and then check their fields.
      if (documentReferencesToSearch.length > 0) {
        const snapshots = await db.getAll(...documentReferencesToSearch);
        for (const snapshot of snapshots) {
          if (snapshot.exists) {
            for (const field of config_1.default.searchFields.split(",")) {
              if (snapshot.get(new firestore_1.FieldPath(field)) === uid) {
                pathsToDelete.push(snapshot.ref.path);
                continue;
              }
            }
          }
        }
      }
      await (0, runBatchPubSubDeletions_1.runBatchPubSubDeletions)(
        {
          firestorePaths: pathsToDelete,
        },
        uid
      );
    }
  });
/*
 * The clearData function removes personal data from the RealTime Database,
 * Storage, and Firestore. It waits for all deletions to complete, and then
 * returns a success message.
 */
exports.clearData = functions.auth.user().onDelete(async (user) => {
  logs.start();
  const { firestorePaths, rtdbPaths, storagePaths, enableSearch } =
    config_1.default;
  const { uid } = user;
  const promises = [];
  if (firestorePaths) {
    promises.push(clearFirestoreData(firestorePaths, uid));
  } else {
    logs.firestoreNotConfigured();
  }
  if (rtdbPaths && databaseURL) {
    promises.push(clearDatabaseData(rtdbPaths, uid));
  } else {
    logs.rtdbNotConfigured();
  }
  if (storagePaths) {
    promises.push(clearStorageData(storagePaths, uid));
  } else {
    logs.storageNotConfigured();
  }
  await Promise.all(promises);
  /** If search mode enable, run pubsub search fn */
  if (enableSearch) {
    await (0, search_1.search)(uid, 1);
  }
  /** If search function provided, return a list of queries */
  if (
    config_1.default.searchFunction &&
    config_1.default.searchFunction !== ""
  ) {
    await (0, runCustomSearchFunction_1.runCustomSearchFunction)(uid);
  }
  logs.complete(uid);
});
const clearDatabaseData = async (databasePaths, uid) => {
  logs.rtdbDeleting();
  const paths = extractUserPaths(databasePaths, uid);
  const promises = paths.map(async (path) => {
    try {
      logs.rtdbPathDeleting(path);
      await admin.database().ref(path).remove();
      logs.rtdbPathDeleted(path);
    } catch (err) {
      logs.rtdbPathError(path, err);
    }
  });
  await Promise.all(promises);
  if (eventChannel) {
    /** Send database deletion event */
    await eventChannel.publish({
      type: `firebase.extensions.delete-user-data.v1.database`,
      data: {
        uid,
        paths,
      },
    });
  }
  logs.rtdbDeleted();
};
const clearStorageData = async (storagePaths, uid) => {
  logs.storageDeleting();
  const paths = extractUserPaths(storagePaths, uid);
  const promises = paths.map(async (path) => {
    const parts = path.split("/");
    const bucketName = parts[0];
    const bucket =
      bucketName === "{DEFAULT}"
        ? admin.storage().bucket(config_1.default.storageBucketDefault)
        : admin.storage().bucket(bucketName);
    const prefix = parts.slice(1).join("/");
    try {
      logs.storagePathDeleting(prefix);
      await bucket.deleteFiles({
        prefix,
      });
      logs.storagePathDeleted(prefix);
    } catch (err) {
      if (err.code === 404) {
        logs.storagePath404(prefix);
      } else {
        logs.storagePathError(prefix, err);
      }
    }
  });
  await Promise.all(promises);
  if (eventChannel) {
    /** Send storage deletion event */
    await eventChannel.publish({
      type: `firebase.extensions.delete-user-data.v1.storage`,
      data: {
        uid,
        paths,
      },
    });
  }
  logs.storageDeleted();
};
const clearFirestoreData = async (firestorePaths, uid) => {
  logs.firestoreDeleting();
  const paths = extractUserPaths(firestorePaths, uid);
  const promises = paths.map(async (path) => {
    try {
      const isRecursive = config_1.default.firestoreDeleteMode === "recursive";
      if (!isRecursive) {
        const firestore = admin.firestore();
        logs.firestorePathDeleting(path, false);
        // Wrapping in transaction to allow for automatic retries (#48)
        await firestore.runTransaction((transaction) => {
          transaction.delete(firestore.doc(path));
          return Promise.resolve();
        });
        logs.firestorePathDeleted(path, false);
      } else {
        logs.firestorePathDeleting(path, true);
        await firebase_tools.firestore.delete(path, {
          project: process.env.PROJECT_ID,
          recursive: true,
          yes: true, // auto-confirmation
        });
        logs.firestorePathDeleted(path, true);
      }
    } catch (err) {
      logs.firestorePathError(path, err);
    }
  });
  await Promise.all(promises);
  if (eventChannel) {
    /** Send firestore deletion event */
    await eventChannel.publish({
      type: `firebase.extensions.delete-user-data.v1.firestore`,
      data: {
        uid,
        documentPaths: paths,
      },
    });
  }
  logs.firestoreDeleted();
};
const extractUserPaths = (paths, uid) => {
  return paths.split(",").map((path) => replaceUID(path, uid));
};
const replaceUID = (path, uid) => {
  return path.replace(/{UID}/g, uid);
};
