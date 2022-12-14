"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const admin = __importStar(require("firebase-admin"));
const config = __importStar(require("./config"));
const { PubSub } = require("@google-cloud/pubsub");
const search = async (uid, depth, document) => {
  const db = admin.firestore();
  const pubsub = new PubSub();
  const topic = pubsub.topic(
    `projects/${
      process.env.GOOGLE_CLOUD_PROJECT || process.env.PROJECT_ID
    }/topics/${config.default.discoveryTopic}`
  );
  const collections = !document
    ? await db.listCollections()
    : await document.listCollections();
  for (const collection of collections) {
    topic.publish(
      Buffer.from(JSON.stringify({ path: collection.path, uid, depth }))
    );
  }
};
exports.search = search;
