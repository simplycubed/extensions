# Get started

## Using the Webflow Events Firestore extension

The Webflow Events extension (`webflow-events-firestore`) lets you sync Webflow data in your Firebase project. You can configure this extension to sync Form Submissions, Site Publishing, Ecommerce Orders and Inventory, Webflow Memberships (users), and Collection Items in the CMS with Cloud Firestore. Each trigger of the extension is keyed to the user's Webflow `_id`.

## Prerequisites

- This extension is used to manage user data in your Firebase project's [Cloud Firestore](https://firebase.google.com/docs/firestore) to keep it in sync with the data stored in Webflow. These services need to be enaled prior to installing the extension.

## **Install the extension**

To install the extension, follow the steps on the [Install Firebase Extension](https://firebase.google.com/docs/extensions/install-extensions) page. In summary, do one of the following:

- **Firebase console:** Click the following button:

  [Install the Webflow Events extension](https://console.firebase.google.com/project/_/extensions/install?ref=simplycubed%2Fwebflow-events-firestore)

- **CLI:** Run the following command:

  ```bash
  firebase ext:install simplycubed/webflow-events-firestore --project=projectId-or-alias
  ```

During the installation of the extension, you will be prompted to specify a number of configuration parameters:

- **Cloud Functions location:**

  Select the location of where you want to deploy the functions created for this extension. You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- **Cloud Firestore paths:**

  Which paths in your Cloud Firestore instance contains user data? Leave empty if you don't use Cloud Firestore. Enter the full paths, separated by commas. You can represent the User ID of the user with `{_id}`. For example, if you have the collections `users` and `admins`, and each collection has documents with the User ID as document IDs, then you can enter `users/{_id},admins/{_id}`.

## Disclaimer

This package is not an official Google Firebase or Webflow product. It is an open-source project supported by SimplyCubed.
