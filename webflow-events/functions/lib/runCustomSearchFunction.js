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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCustomSearchFunction = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const runBatchPubSubDeletions_1 = require("./runBatchPubSubDeletions");
const logs = __importStar(require("./logs"));
const config_1 = __importDefault(require("./config"));
const runCustomSearchFunction = async (uid) => {
  const response = await (0, node_fetch_1.default)(
    config_1.default.searchFunction,
    {
      method: "POST",
      body: JSON.stringify({ uid }),
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) {
    const body = await response.text();
    logs.customFunctionError(new Error(body));
    return;
  }
  /** Get user resonse **/
  const json = await response.json();
  // Support returning an array directly
  if (Array.isArray(json)) {
    return (0, runBatchPubSubDeletions_1.runBatchPubSubDeletions)(
      { firestorePaths: json },
      uid
    );
  }
  return (0, runBatchPubSubDeletions_1.runBatchPubSubDeletions)(json, uid);
};
exports.runCustomSearchFunction = runCustomSearchFunction;
