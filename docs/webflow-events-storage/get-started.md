# Get started

## Using the Webflow Events Storage extension

The Webflow Events extension (`webflow-events-storage`) lets you sync Webflow data in your Firebase project. You can configure this extension to sync Form Submissions, Site Publishing, Ecommerce Orders and Inventory, Webflow Memberships (users), and Collection Items in the CMS with Cloud Cloud Storage. Each trigger of the extension is keyed to the user's Webflow `_id`.

## Prerequisites

- This extension is used to manage user data in your Firebase project's [Cloud Storage](https://firebase.google.com/docs/storage) to keep it in sync with the data stored in Webflow. These services need to be enaled prior to installing the extension.

## **Install the extension**

To install the extension, follow the steps on the [Install Firebase Extension](https://firebase.google.com/docs/extensions/install-extensions) page. In summary, do one of the following:

- **Firebase console:** Click the following button:

  [Install the Webflow Events Storage extension](https://console.firebase.google.com/project/_/extensions/install?ref=simplycubed%2Fwebflow-events-storage)

- **CLI:** Run the following command:

  ```bash
  firebase ext:install simplycubed/webflow-events-storage --project=projectId-or-alias
  ```

During the installation of the extension, you will be prompted to specify a number of configuration parameters:

- **Cloud Storage paths:**

  Where in Google Cloud Storage do you store user data? Leave empty if you don't use Cloud Storage. Enter the full paths to files or directories in your Storage buckets. To manage a User ID-labeled directory (like `users/{_id}`), enter `{DEFAULT}/users/{_id}`. This will result in `{DEFAULT}/users/{_id}`.

## Disclaimer

This package is not an official Google Firebase or Webflow product. It is an open-source project supported by SimplyCubed.
