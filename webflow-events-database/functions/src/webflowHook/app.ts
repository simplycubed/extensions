import express from "express";
import morgan from "morgan";
import Webflow from "webflow-api";
import * as handlers from "./handler";
import { database } from "../init";
import config from "../config";
import {
  logger,
  createValidateWebflowSignatureMw,
  configureWebflowAuthEndpoints,
} from "@simplycubed/webflow-utils";
import { json } from "body-parser";

const webflow = new Webflow();

const validateWebflowSignatureMw = createValidateWebflowSignatureMw(
  config.webflowAppClientSecret
);

export const webhookApp = express();

// attach logger middleware
webhookApp.use(morgan("tiny"));

// body parser
webhookApp.use(json());

// error middleware
webhookApp.use((error: any, req: any, res: any, next: any) => {
  logger.log("error", error);
  res
    .status(500)
    .json({ error: "something went wrong", details: error?.message });
});

// health endpoint
webhookApp.get("/health", (req, res) => {
  res.status(200).json({ status: `running` });
});

configureWebflowAuthEndpoints(webhookApp, webflow, {
  webflowAppClientID: config.webflowAppClientID,
  webflowAppClientSecret: config.webflowAppClientSecret,
  location: config.location,
  projectId: config.projectId,
  extensionPrefix: "ext-webflow-events-database",
  webflowSiteID: config.webflowSiteID,
});

// Webflow Hooks
webhookApp.post(
  "/membershipsUserAccountAdded",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleMembershipsUserAccountAdded(database, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/membershipsUserAccountUpdated",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleMembershipsUserAccountUpdated(database, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/ecommNewOrder",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleEcommNewOrder(database, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/ecommOrderChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleEcommOrderUpdated(database, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/ecommInventoryChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleEcommInventoryChanged(database, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/collectionItemCreated",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleCollectionItemCreated(database, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/collectionItemChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleCollectionItemChanged(database, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/collectionItemDeleted",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleCollectionItemDeleted(database, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post("/collectionItemUnpublished", async (req, res) => {
  logger.info("payload", req.body);
  await handlers.handleCollectionItemUnpublished(database, req.body);
  res.status(200).json({ status: `success` });
});

webhookApp.post("/formSubmission", async (req, res) => {
  logger.info("payload", req.body);
  await handlers.handleFormSubmission(database, req.body);
  res.status(200).json({ status: `success` });
});

webhookApp.post("/sitePublish", async (req, res) => {
  logger.info("payload", req.body);
  await handlers.handleSitePublish(database, req.body);
  res.status(200).json({ status: `success` });
});
