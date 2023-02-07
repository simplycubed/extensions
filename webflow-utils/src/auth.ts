import express from "express";
import { logger } from "./logger";
import Webflow from "webflow-api";
import { getFunctionBaseUrl } from "./helpers";
import { triggerTypeEndpointMap } from "./types";

export interface AuthParams {
  webflowAppClientID: string;
  webflowAppClientSecret: string;
  location: string;
  projectId: string;
  extensionPrefix: string;
  webflowSiteID: string;
}

export const configureWebflowAuthEndpoints = (
  webhookApp: express.Express,
  webflow: Webflow,
  params: AuthParams
) => {
  const {
    webflowAppClientID,
    webflowAppClientSecret,
    location,
    projectId,
    extensionPrefix,
    webflowSiteID,
  } = params;
  // Webflow OAuth endpoints
  webhookApp.get("/authorize", async (req, res) => {
    const url = webflow.authorizeUrl({ client_id: webflowAppClientID });
    res.redirect(url);
  });

  webhookApp.get("/auth-success", async (req, res) => {
    logger.info("Code:", req.query?.code);
    // retrieve access token
    const { access_token } = await webflow.accessToken({
      client_id: webflowAppClientID,
      client_secret: webflowAppClientSecret,
      code: req.query?.code as string,
    });

    const app = new Webflow({ token: access_token });

    const functionBaseUrl = getFunctionBaseUrl(location, projectId);
    const triggerTypes = Object.keys(triggerTypeEndpointMap);
    // create web hooks
    for (const triggerType of triggerTypes) {
      const webhook = await app.createWebhook({
        triggerType: triggerType,
        url: `${functionBaseUrl}/${extensionPrefix}-webflowHook/${triggerTypeEndpointMap[triggerType]}`,
        siteId: webflowSiteID,
      });
      logger.info("webhook response:", webhook?.response?.data);
    }

    res.status(200).json({ status: `success` });
  });
};
