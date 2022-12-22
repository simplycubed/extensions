import express from "express";
import morgan from "morgan";
import Webflow from "webflow-api";
import {
  logUserAddedPayload,
  logWebflowAuthRedirect,
  logWebhookResponse,
} from "../logs";
import { handleMembershipsUserAccountAdded } from "./handler";
import { firstoreDb, storage } from "../init";
import config from "../config";
import { getFunctionBaseUrl } from "../helpers";
import { triggerTypeEndpointMap } from "./types";
import { createValidateWebflowSignatureMw } from "./validateWebflowSignature";
import { json } from "body-parser";
import { logger } from "firebase-functions";

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
  console.log("error", error);
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
  logWebflowAuthRedirect(req.query?.code);
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
    logWebhookResponse(webhook?.response?.data);
  }

  res.status(200).json({ status: `success` });
});

// Webflow Hooks
webhookApp.post(
  "/membershipsUserAccountAdded",
  validateWebflowSignatureMw,
  async (req, res) => {
    logUserAddedPayload(req.body);
    await handleMembershipsUserAccountAdded(firstoreDb, storage, req.body);
    res.status(200).json({ status: `done` });
  }
);

webhookApp.post(
  "/membershipsUserAccountUpdated",
  validateWebflowSignatureMw,
  async (req, res) => {
    console.log(req.body, req.headers);
    res.status(500).json({ message: `not implemented` });
  }
);

webhookApp.post(
  "/ecommNewOrder",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.log(req.body, req.headers);
    res.status(500).json({ message: `not implemented` });
  }
);

webhookApp.post(
  "/ecommOrderChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.log(req.body, req.headers);
    res.status(500).json({ message: `not implemented` });
  }
);

webhookApp.post(
  "/ecommInventoryChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.log(req.body, req.headers);
    res.status(500).json({ message: `not implemented` });
  }
);

webhookApp.post(
  "/collectionItemCreated",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.log(req.body, req.headers);
    res.status(500).json({ message: `not implemented` });
  }
);

webhookApp.post(
  "/collectionItemChanged",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.log(req.body, req.headers);
    res.status(500).json({ message: `not implemented` });
  }
);

webhookApp.post(
  "/collectionItemDeleted",
  validateWebflowSignatureMw,
  async (req, res) => {
    logger.log(req.body, req.headers);
    res.status(500).json({ message: `not implemented` });
  }
);

webhookApp.post("/collectionItemUnpublished", async (req, res) => {
  logger.log(req.body, req.headers);
  res.status(500).json({ message: `not implemented` });
});
