import express from "express";
import morgan from "morgan";
import Webflow from "webflow-api";
import * as logger from "../logger";
import * as handlers from "./handler";
import { firstoreDb, storage } from "../init";
import config from "../config";
import { getFunctionBaseUrl } from "../helpers";
import { triggerTypeEndpointMap } from "./types";
import { createValidateWebflowSignatureMw } from "./validateWebflowSignature";
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

// Webflow OAuth endpoints
webhookApp.get("/authorize", async (req, res) => {
  const url = webflow.authorizeUrl({ client_id: config.webflowAppClientID });
  res.redirect(url);
});

webhookApp.get("/auth-success", async (req, res) => {
  logger.info("Code:", req.query?.code);
  // retrieve access token
  const { access_token } = await webflow.accessToken({
    client_id: config.webflowAppClientID,
    client_secret: config.webflowAppClientSecret,
    code: req.query?.code as string,
  });

  const app = new Webflow({ token: access_token });

  const functionBaseUrl = getFunctionBaseUrl();
  const triggerTypes = Object.keys(triggerTypeEndpointMap);

  // create web hooks
  for (const triggerType of triggerTypes) {
    const webhook = await app.createWebhook({
      triggerType: triggerType,
      url: `${functionBaseUrl}/webflowHook/${triggerTypeEndpointMap[triggerType]}`,
      siteId: config.webflowSiteID,
    });
    logger.info("webhook response:", webhook?.response?.data);
  }

  res.status(200).json({ status: `success` });
});

// Webflow Hooks
webhookApp.post(
  "/membershipsUserAccountAdded",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleMembershipsUserAccountAdded(
      firstoreDb,
      storage,
      req.body
    );
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/membershipsUserAccountUpdated",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleMembershipsUserAccountUpdated(
      firstoreDb,
      storage,
      req.body
    );
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/ecommNewOrder",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleEcommNewOrder(firstoreDb, storage, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/ecommOrderChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleEcommOrderUpdated(firstoreDb, storage, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/ecommInventoryChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleEcommInventoryChanged(firstoreDb, storage, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/collectionItemCreated",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleCollectionItemCreated(firstoreDb, storage, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/collectionItemChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleCollectionItemChanged(firstoreDb, storage, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post(
  "/collectionItemDeleted",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.info("payload", req.body);
    await handlers.handleCollectionItemDeleted(firstoreDb, storage, req.body);
    res.status(200).json({ status: `success` });
  }
);

webhookApp.post("/collectionItemUnpublished", async (req, res) => {
  logger.info("payload", req.body);
  await handlers.handleCollectionItemUnpublished(firstoreDb, storage, req.body);
  res.status(200).json({ status: `success` });
});
