# Get started

## Using the Webflow Memberships extension

The Webflow Memberships extension (`webflow-memberships`) lets you sync user data in your Firebase project when users are added or updated in [Webflow Memberships](https://webflow.com/memberships) the user data is synced with Cloud Firestore, Realtime Database, or Cloud Storage.

### Membership Payload

Full (Webflow Membership event object)[https://developers.webflow.com/reference/memberships_user_account_added] details are in the Webflow API documentation.

## Prerequisites

- You must use [Webflow Memberships](https://webflow.com/memberships) to manage your users.

## **Install the extension**

To install the extension, follow the steps on the [Install Firebase Extension](https://firebase.google.com/docs/extensions/install-extensions) page. In summary, do one of the following:

- **Firebase console:** Click the following button:

  [Install the Webflow Memberships extension](https://console.firebase.google.com/project/_/extensions/install?ref=simplycubed%2Fwebflow-memberships)

- **CLI:** Run the following command:

  ```bash
  firebase ext:install simplycubed/webflow-memberships --project=projectId-or-alias
  ```

During the installation of the extension, you will be prompted to specify the following configuration parameters:

- **Cloud Functions location:**

  Select the location of where you want to deploy the functions created for this extension. You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- **Cloud Firestore paths:**

  > The createdOn and updatedOn timestamps have been converted from strings to timestamps.

  Desired path to store the data in Cloud Firestore? Leave empty if you don't use Cloud Firestore. For example, `users`, `simplycubed`, `webflow` etc. setting `users` will result in in `users/{_id}`.

- **Realtime Database instance:**

  In which Realtime Database instance do you want to manage user data?

- **Realtime Database location:**

  (Only applicable if you provided the `Realtime Database instance` parameter.) In which Realtime Database location do you want to manage user data?

- **Realtime Database paths:**

> The createdOn and updatedOn timestamps have been converted from strings to timestamps.

Desired path to store the data in the Realtime Database? Leave empty if you don't use Realtime Database. Enter the collection name, for example: `users`, `simplycubed`, `webflow`, etc. setting `users` will result in `users/{_id}`.

- **Cloud Storage paths:**

  > The Webflow Membership Event object is stored as a JSON file at the specified location.

  Desired location in Google Cloud Storage? Leave empty if you don't use Cloud Storage. Enter the Storage bucket name including any specific directory. Use `{DEFAULT}` to represent your default Storage bucket. For example, setting the default bucket with the `users` directory would result in `{DEFAULT}/users/{_id}.json`.

## Disclaimer

This package is not an official Google Firebase or Webflow product. It is an open-source project supported by SimplyCubed.
