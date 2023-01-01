# Webflow Events Database

**Author**: SimplyCubed (**[https://simplycubed.com](https://simplycubed.com)**)

**Description**: Webflow integration for Google Firebase Realtime Database

**Configuration Parameters:**

- Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database or Storage bucket. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- Realtime Database instance: To which Realtime Database instance do you want to sync data to?

- Realtime Database location: (Only applicable if you provided the `Realtime Database instance` parameter.) To which Realtime Database location do you want to sync data to?

- Realtime database path for storing users: Realtime database path for user events sync to? Leave empty if you don't want to sync user membership events.

- Realtime database path for storing orders: Realtime database path for order events sync to? Leave empty if you don't want to sync order events

- Realtime database path for storing inventory: Realtime database path for inventory events sync to? Leave empty if you don't want to sync inventory events.

- Realtime database path for storing collection items: Realtime database path for collection item events sync to? Leave empty if you don't want to sync collection item events

- Realtime database path for storing form submissions: Realtime database path for form submission events sync to? Leave empty if you don't want to sync form submission events

- Realtime database path for storing site publish events: Realtime database path for site publish events sync to? Leave empty if you don't want to sync site publish events

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
