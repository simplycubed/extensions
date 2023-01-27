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

export default {
  debug: process.env.DEBUG === "true" || process.env.DEBUG == "1",
  location: process.env.LOCATION,
  projectId:
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT ||
    process.env.PROJECT_ID,

  // paths
  userFirestorePath: process.env.USER_FIRESTORE_PATH,
  orderFirestorePath: process.env.ORDER_FIRESTORE_PATH,
  inventoryFirestorePath: process.env.INVENTORY_FIRESTORE_PATH,
  collectionItemFirestorePath: process.env.COLLECTION_ITEM_FIRESTORE_PATH,
  formSubmissionFirstorePath: process.env.FORM_SUBMISSION_FIRESTORE_PATH,
  sitePublishFirestorePath: process.env.SITE_PUBLISH_FIRESTORE_PATH,
  // Webflow credentials
  webflowAppClientID: process.env.WEBFLOW_APP_CLIENT_ID,
  webflowAppClientSecret: process.env.WEBFLOW_APP_CLIENT_SECRET,
  webflowSiteID: process.env.WEBFLOW_SITE_ID,
};
