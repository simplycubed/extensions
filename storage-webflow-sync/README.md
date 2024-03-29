# Sync Webflow Events to Storage

**Author**: [SimplyCubed](https://simplycubed.com)

**Description**: Webflow integration for Google Cloud Storage

**Configuration Parameters:**

- Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database or Storage bucket. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- Cloud Storage bucket: Which Google Cloud Storage bucket do you want to sync data to?

- Cloud Storage path for storing users: To which collection should the user events sync to? Leave empty if you don't want to sync user membership events.

- Cloud Storage path for storing orders: To which collection should the order events sync to? Leave empty if you don't want to sync order events.

- Cloud Storage path for storing inventory: To which collection should the inventory events sync to? Leave empty if you don't want to sync inventory events.

- Cloud Storage path for storing collection items: To which collection should the collection items events sync to? Leave empty if you don't want to sync collection items events.

- Cloud Storage path for storing collection form submissions: To which collection should the form submissions events sync to? Leave empty if you don't want to sync form submissions events.

- Cloud Storage path for storing collection site publish: To which collection should the site publish events sync to? Leave empty if you don't want to sync site publish events.

- Client ID of the Webflow app from which hooks will be created.: Client ID of the Webflow app from which hooks will be created.

- Client secret of the Webflow app from which hooks will be created.: Client secret of the Webflow app from which hooks will be created.

- Webflow site id for which hooks will be created.: Webflow site id for which hooks will be created.

**Cloud Functions:**

- **webflowHook:** Hooks for Webflow, contains endpoints that handle events from Webflow and OAuth endpoints for configuring webhooks.

**Access Required**:

This extension will operate with the following project IAM roles:

- storage.objectAdmin (Reason: Allows the extension to create, update and delete user data from Cloud Storage.)

[![SimplyCubed Extensions: Starter Kits](../starter-kits.png)](https://webevents.dev/)
