# `webflow-utils`

This package contains supporting helper functions and Types for Webflow.

## Usage

Webflow signature middleware

```typescript
import { createValidateWebflowSignatureMw } from "@simplycubed/webflow-utils";
import express from "express";

const validateWebflowSignatureMw = createValidateWebflowSignatureMw(
  "<webflow-app-client-secret>"
);
const app = express();
// attach middleware to Webflow webhook
app.post("/webflow-hook", validateWebflowSignatureMw, async (req, res) => {});
```

Configure Webflow OAuth endpoints to automatically create webhooks when authenticated.

```typescript
import { configureWebflowAuthEndpoints } from "@simplycubed/webflow-utils";
import express from "express";
import Webflow from "webflow-api";

const app = express();
const webflow = new Webflow();

configureWebflowAuthEndpoints(app, webflow, {
  webflowAppClientID: "<webflow-app-client-id>",
  webflowAppClientSecret: "<webflow-app-client-secret>",
  location: "<function-location>",
  projectId: "<google-project-id>",
  extensionPrefix: "<firestore-extension-prefix>",
  webflowSiteID: "<webflow-site-id>",
});
```

[![SimplyCubed Extensions: Starter Kits](../starter-kits.png)](https://webevents.dev/)
