# Get started

## Using the Webflow Memberships extension

The Webflow Memberships extension (`webflow-memberships`) lets you create and manage users in your Firebase project when users are added or updated in [Webflow Memberships](https://webflow.com/memberships). You can configure this extension to manage users in any or all of the following: Cloud Firestore, Realtime Database, or Cloud Storage. Each trigger of the extension is keyed to the user's Webflow `_id`.

## Prerequisites

- You must use [Webflow Memberships](https://webflow.com/memberships) to manage your users.

- This extension is used to manage user data in your Firebase project's [Cloud Firestore](https://firebase.google.com/docs/firestore), [Realtime Database](https://firebase.google.com/docs/database), and/or [Cloud Storage](https://firebase.google.com/docs/storage) to keep them in sync with the data stored in Webflow.

## **Install the extension**

To install the extension, follow the steps on the [Install Firebase Extension](https://firebase.google.com/docs/extensions/install-extensions) page. In summary, do one of the following:

- **Firebase console:** Click the following button:

  [Install the Webflow Memberships extension](https://console.firebase.google.com/project/_/extensions/install?ref=simplycubed%2Fwebflow-memberships)

- **CLI:** Run the following command:

  ```bash
  firebase ext:install simplycubed/webflow-memberships --project=projectId-or-alias
  ```

During the installation of the extension, you will be prompted to specify a number of configuration parameters:

- **Cloud Functions location:**

  Select the location of where you want to deploy the functions created for this extension. You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- **Cloud Firestore paths:**

  Which paths in your Cloud Firestore instance contains user data? Leave empty if you don't use Cloud Firestore. Enter the full paths, separated by commas. You can represent the User ID of the user with `{_id}`. For example, if you have the collections `users` and `admins`, and each collection has documents with the User ID as document IDs, then you can enter `users/{_id},admins/{_id}`.

- **Realtime Database instance:**

  In which Realtime Database instance do you want to manage user data?

- **Realtime Database location:**

  (Only applicable if you provided the `Realtime Database instance` parameter.) In which Realtime Database location do you want to manage user data?

- **Realtime Database paths:**

  Which paths in your Realtime Database instance contain user data? Leave empty if you don't use Realtime Database. Enter the full paths, separated by commas. You can represent the User ID of the user with `{_id}`. For example: `users/{_id},admins/{_id}`.

- **Cloud Storage paths:**

  Where in Google Cloud Storage do you store user data? Leave empty if you don't use Cloud Storage. Enter the full paths to files or directories in your Storage buckets, separated by commas. Use `{_id}` to represent the User ID of the new user, and use `{DEFAULT}` to represent your default Storage bucket. To manage a User ID-labeled directory (like `users/{_id}`), enter `{DEFAULT}/users/{_id}`. If you have the collections `users` and `admins`, each collection has documents with the User ID as document IDs, then you can enter `{DEFAULT}/users/{_id},{DEFAULT}/admins/{_id}`.

#### By path

When configuring the Cloud Firestore, Realtime Database & Cloud Storage paths, it’s possible to define a `_id` variable in the paths which will be replaced with the authenticated user’s Webflow `_id`. When a user is created, the extension will update all data keyed on that UID at the given paths, for example:

- Cloud Firestore path(s): `users/{_id},admins/{_id}`
- Realtime Database path(s): `users/{_id}`
- Cloud Storage path(s): `{DEFAULT}/users/{_id},{DEFAULT}/admins/{_id}`


## Disclaimer

This package is not an official Google Firebase or Webflow product. It is an open-source project supported by SimplyCubed.