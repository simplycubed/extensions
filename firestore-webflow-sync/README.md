# Webflow Events Firestore

**Author**: [SimplyCubed](https://simplycubed.com)

**Description**: Webflow integration for Google Cloud Firestore

**Configuration Parameters:**

- Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database or Storage bucket. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- Cloud Firestore collection path for storing users: To which collection should the user events sync to? Leave empty if you don't want to sync user membership events.

- Cloud Firestore collection path for storing orders: To which collection should the order events sync to? Leave empty if you don't want to sync order events.

- Cloud Firestore collection path for storing inventory: To which collection should the inventory events sync to? Leave empty if you don't want to sync inventory events.

- Cloud Firestore collection path for storing collection items: To which collection should the collection items events sync to? Leave empty if you don't want to sync collection items events.

- Cloud Firestore collection path for storing form submissions: To which collection should the form submissions events sync to? Leave empty if you don't want to sync form submissions events.

- Cloud Firestore collection path for storing site publish events: To which collection should the site publish events sync to? Leave empty if you don't want to sync site publish events.

- Client ID of the webflow app from which hooks will be created.: Client ID of the webflow app from which hooks will be created.

- Client secret of the webflow app from which hooks will be created.: Client secret of the webflow app from which hooks will be created.

- Webflow site id for which hooks will be created.: Webflow site id for which hooks will be created.

**Cloud Functions:**

- **webflowHook:** Hooks for webflow, contains endpoints that handle events from webflow and oauth endpoints for configuring webhooks.

**Access Required**:

This extension will operate with the following project IAM roles:

- datastore.owner (Reason: Allows the extension to create, update and delete user data from Cloud Firestore.)

- firebasedatabase.admin (Reason: Allows the extension to create, update and delete user data from Realtime Database.)

- storage.admin (Reason: Allows the extension to create, update and delete user data from Cloud Storage.)
