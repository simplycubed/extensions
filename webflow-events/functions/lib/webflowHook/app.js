"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookApp = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const logs_1 = require("../logs");
const handler_1 = require("./handler");
const init_1 = require("../init");
exports.webhookApp = (0, express_1.default)();
// attach logger middleware
exports.webhookApp.use((0, morgan_1.default)("tiny"));
// error middleware
exports.webhookApp.use((error, req, res, next) => {
  console.log("error", error);
  res
    .status(500)
    .json({ error: "something went wrong", details: error?.message });
});
// health endpoint
exports.webhookApp.get("/health", (req, res) => {
  res.status(200).json({ status: `running` });
});
exports.webhookApp.post("/membershipsUserAccountAdded", async (req, res) => {
  (0, logs_1.logUserAddedPayload)(req.body);
  await (0, handler_1.handleOnMembershipsUserAccountAdded)(
    init_1.firstoreDb,
    req.body
  );
  res.status(200).json({ status: `done` });
});
exports.webhookApp.post("/membershipsUserAccountUpdated", async (req, res) => {
  console.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
exports.webhookApp.post("/ecommNewOrder", async (req, res) => {
  console.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
exports.webhookApp.post("/ecommOrderChanged", async (req, res) => {
  console.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
exports.webhookApp.post("/ecommInventoryChanged", async (req, res) => {
  console.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
exports.webhookApp.post("/collectionItemCreated", async (req, res) => {
  console.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
exports.webhookApp.post("/collectionItemChanged", async (req, res) => {
  console.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
exports.webhookApp.post("/collectionItemDeleted", async (req, res) => {
  console.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
exports.webhookApp.post("/collectionItemUnpublished", async (req, res) => {
  console.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
