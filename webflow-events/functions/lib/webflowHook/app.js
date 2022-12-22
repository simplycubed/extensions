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
const webflow_api_1 = __importDefault(require("webflow-api"));
const logs_1 = require("../logs");
const handler_1 = require("./handler");
const init_1 = require("../init");
const config_1 = __importDefault(require("../config"));
const helpers_1 = require("../helpers");
const types_1 = require("./types");
const webflow = new webflow_api_1.default();
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
// Webflow OAuth endpoints
exports.webhookApp.get("/authorize", async (req, res) => {
  const url = webflow.authorizeUrl({
    client_id: config_1.default.webflowAppClientID,
  });
  res.redirect(url);
});
exports.webhookApp.get("/auth-success", async (req, res) => {
  (0, logs_1.logWebflowAuthRedirect)(req.query?.code);
  // retrieve access token
  const { access_token } = await webflow.accessToken({
    client_id: config_1.default.webflowAppClientID,
    client_secret: config_1.default.webflowAppClientSecret,
    code: req.query?.code,
  });
  const app = new webflow_api_1.default({ token: access_token });
  const functionBaseUrl = (0, helpers_1.getFunctionBaseUrl)();
  const triggerTypes = Object.keys(types_1.triggerTypeEndpointMap);
  // create web hooks
  for (const triggerType of triggerTypes) {
    const webhook = await app.createWebhook({
      triggerType: triggerType,
      url: `${functionBaseUrl}/webflowHook/${types_1.triggerTypeEndpointMap[triggerType]}`,
      siteId: config_1.default.webflowSiteID,
    });
    (0, logs_1.logWebhookResponse)(webhook?.response?.data);
  }
  res.status(200).json({ status: `success` });
});
// Webflow Hooks
exports.webhookApp.post("/membershipsUserAccountAdded", async (req, res) => {
  (0, logs_1.logUserAddedPayload)(req.body);
  await (0, handler_1.handleMembershipsUserAccountAdded)(
    init_1.firstoreDb,
    init_1.storage,
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
