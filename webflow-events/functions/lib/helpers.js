"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionBaseUrl = exports.getDatabaseUrl = void 0;
/*
 * Copyright 2022 Google LLC
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
const config_1 = __importDefault(require("./config"));
const getDatabaseUrl = (selectedDatabaseInstance, selectedDatabaseLocation) => {
  if (!selectedDatabaseLocation || !selectedDatabaseInstance) return null;
  if (selectedDatabaseLocation === "us-central1")
    return `https://${selectedDatabaseInstance}.firebaseio.com`;
  return `https://${selectedDatabaseInstance}.${selectedDatabaseLocation}.firebasedatabase.app`;
};
exports.getDatabaseUrl = getDatabaseUrl;
const getFunctionBaseUrl = () => {
  return `https://${config_1.default.location}-${config_1.default.projectId}.cloudfunctions.net`;
};
exports.getFunctionBaseUrl = getFunctionBaseUrl;
