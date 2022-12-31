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

import { logger as firebaseLogger } from "firebase-functions";

const debug = process.env.DEBUG === "true" || process.env.DEBUG == "1";

const info = (...params) => {
  if (debug) {
    firebaseLogger.info(...params);
  }
};

const error = (...params) => {
  if (debug) {
    firebaseLogger.error(...params);
  }
};

const log = (...params) => {
  if (debug) {
    firebaseLogger.log(...params);
  }
};

export const logger = {
  info,
  error,
  log,
};
