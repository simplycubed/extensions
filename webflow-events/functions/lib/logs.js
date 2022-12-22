"use strict";
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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWebhookResponse =
  exports.logWebflowAuthRedirect =
  exports.logUserAddedPayload =
  exports.customFunctionError =
  exports.init =
    void 0;
const firebase_functions_1 = require("firebase-functions");
const config_1 = __importDefault(require("./config"));
const init = () => {
  firebase_functions_1.logger.log(
    "Initializing extension with configuration",
    config_1.default
  );
};
exports.init = init;
const customFunctionError = (err) => {
  firebase_functions_1.logger.error(
    `Call to custom hook function threw an error`,
    err
  );
};
exports.customFunctionError = customFunctionError;
const logUserAddedPayload = (payload) => {
  firebase_functions_1.logger.error(`User Added Payload received: `, payload);
};
exports.logUserAddedPayload = logUserAddedPayload;
const logWebflowAuthRedirect = (payload) => {
  firebase_functions_1.logger.info(`Webflow auth redirect code: `, payload);
};
exports.logWebflowAuthRedirect = logWebflowAuthRedirect;
const logWebhookResponse = (payload) => {
  firebase_functions_1.logger.info(`Webhook`, payload);
};
exports.logWebhookResponse = logWebhookResponse;
