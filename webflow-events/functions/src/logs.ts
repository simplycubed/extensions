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

import { logger } from "firebase-functions";
import config from "./config";

export const init = () => {
  logger.log("Initializing extension with configuration", config);
};

export const customFunctionError = (err: Error) => {
  logger.error(`Call to custom hook function threw an error`, err);
};

export const logUserAddedPayload = (payload: any) => {
  logger.error(`User Added Payload received: `, payload);
};

export const logWebflowAuthRedirect = (payload: any) => {
  logger.info(`Webflow auth redirect code: `, payload);
};

export const logWebhookResponse = (payload: any) => {
  logger.info(`Webhook`, payload);
};
