# Get started

## Using the Sync Webflow Events to RTDB extension

The Webflow Events extension (`rtdb-webflow-sync`) lets you sync Webflow data in your Firebase project. You can configure this extension to sync Form Submissions, Site Publishing, Ecommerce Orders and Inventory, Webflow Memberships (users), and Collection Items in the CMS with the Realtime Database. Each trigger of the extension is keyed to the user's Webflow `_id`.

## Prerequisites

- This extension is used to manage user data in your Firebase project's [Realtime Database](https://firebase.google.com/docs/database) to it in sync with the data stored in Webflow. These services need to be enaled prior to installing the extension.

## **Install the extension**

To install the extension, follow the steps on the [Install Firebase Extension](https://firebase.google.com/docs/extensions/install-extensions) page. In summary, do one of the following:

- **Firebase console:** Click the following button:

  [Install the Sync Webflow Events to RTDB extension](https://console.firebase.google.com/project/_/extensions/install?ref=simplycubed%2Frtdb-webflow-sync)

- **CLI:** Run the following command:

  ```bash
  firebase ext:install simplycubed/rtdb-webflow-sync --project=projectId-or-alias
  ```

During the installation of the extension, you will be prompted to specify a number of configuration parameters:

- **Realtime Database instance:**

  In which Realtime Database instance do you want to manage user data?

- **Realtime Database location:**

  (Only applicable if you provided the `Realtime Database instance` parameter.) In which Realtime Database location do you want to manage user data?

- **Realtime Database paths:**

  Which paths in your Realtime Database instance contain user data? Leave empty if you don't use Realtime Database. Enter the collection name. For example, `user` results in `users/{_id}`.

## Disclaimer

This package is not an official Google Firebase or Webflow product. It is an open-source project supported by SimplyCubed.
