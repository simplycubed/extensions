# Get started

## Using the Webflow Memberships extension

The Webflow Memberships extension (`webflow-memberships`) lets you create and update users in your Firebase project when users are created in [Webflow Memberships](https://webflow.com/memberships). You can configure this extension to create users in any or all of the following: Cloud Firestore, Realtime Database, or Cloud Storage. Each trigger of the extension to create data is keyed to the user's `_id`.

> **Note:** To use this extension, you need to manage your users with Webflow Memberships.

## Prerequisites

- You must use [Webflow Memberships](https://webflow.com/memberships) to manage your users.

- This extension only creates and updates data from [Cloud Firestore](https://firebase.google.com/docs/firestore), [Realtime Database](https://firebase.google.com/docs/database), and [Cloud Storage](https://firebase.google.com/docs/storage).

## **Install the extension**

To install the extension, follow the steps on the [Install Firebase Extension](https://firebase.google.com/docs/extensions/install-extensions) page. In summary, do one of the following:

- **Firebase console:** Click the following button:

  [Install the Webflow Memberships extension](https://console.firebase.google.com/project/_/extensions/install?ref=simplycubed%2Fwebflow-memberships)

- **CLI:** Run the following command:

  ```bash
  firebase ext:install simplycubed/memberships --project=projectId-or-alias
  ```

During the installation of the extension, you will be prompted to specify a number of configuration parameters:

- **Cloud Functions location:**

  Select the location of where you want to deploy the functions created for this extension. You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- **Cloud Firestore paths:**

  Which paths in your Cloud Firestore instance contain user data? Leave empty if you don't use Cloud Firestore. Enter the full paths, separated by commas. You can represent the User ID of the user with `{_id}`. For example, if you have the collections `users` and `admins`, and each collection has documents with the User ID as document IDs, then you can enter `users/{_id},admins/{_id}`.

- **Realtime Database instance:**

  From which Realtime Database instance do you want to delete user data?

- **Realtime Database location:**

  (Only applicable if you provided the `Realtime Database instance` parameter.) From which Realtime Database location do you want to create and update user data?

- **Realtime Database paths:**

  Which paths in your Realtime Database instance contain user data? Leave empty if you don't use Realtime Database. Enter the full paths, separated by commas. You can represent the User ID of the user with `{_id}`. For example: `users/{_id},admins/{_id}`.

- **Cloud Storage paths:**

  Where in Google Cloud Storage do you store user data? Leave empty if you don't use Cloud Storage. Enter the full paths to files or directories in your Storage buckets, separated by commas. Use `{_id}` to represent the User ID of the deleted user, and use `{DEFAULT}` to represent your default Storage bucket. Here's a series of examples. To delete all the files in your default bucket with the file naming scheme `{_id}-pic.png`, enter `{DEFAULT}/{_id}-pic.png`. To also delete all the files in another bucket called my-app-logs with the file naming scheme `{_id}-logs.txt`, enter `{DEFAULT}/{_id}-pic.png,my-app-logs/{_id}-logs.txt`. To *also* delete a User ID-labeled directory and all its files (like `media/{_id}`), enter `{DEFAULT}/{_id}-pic.png,my-app-logs/{_id}-logs.txt,{DEFAULT}/media/{_id}`.

### Discovering Data for Deletion

There are a few mechanisms that this extension uses to discover data for deletion. These mechanisms have to be explicitly configured for the extension to delete data. The extension will only delete data that is explicitly configured to delete based on the mechanisms provided.

Be aware of the following behavioral differences between each service:

- Firestore: the default behavior is to shallow delete a document (sub-collections will not be deleted). To recursively delete all sub-collections of a document, set the “Cloud Firestore delete mode” option to “Recursive”.
- Realtime Database: all data at the specified node will be deleted.
- Storage: if a directory path is specified, all files and sub-directories will be deleted.

#### By path

When configuring the Cloud Firestore, Realtime Database & Cloud Storage paths, it’s possible to define a `UID` variable in the paths which will be replaced with the authenticated user’s UID. When a user is deleted, the extension will delete all data keyed on that UID at the given paths, for example:

- Cloud Firestore path(s): `users/{UID},admins/{UID}`
- Realtime Database path(s): `likes/{UID}`
- Cloud Storage path(s): `{DEFAULT}/uploads/{UID},{DEFAULT}/avatars/{UID}.jpeg`

#### Auto Discovery (Firestore)

To enable the extension to automatically discover Firestore documents to delete, set the “Enable auto discovery” configuration parameter to “Yes”.

Auto-discovery works by automatically traversing the database to find collections and documents which should be deleted according to your configuration. The extension identifies those collections and documents with the following methodology:

1. First, the extension finds all root collections in the database. If a collection’s ID matches that of the user’s UID, the entire collection is deleted (deletion is either recursive or shallow, depending on the extensions’s configuration for “Cloud Firestore delete mode”).
2. Secondly, if the collection ID does not match, the extension will attempt to identify and delete a document if its the document ID matches that of the user’s UID.
3. Finally, for each document:
   a. If the current search depth (see below) is less than or equal to the configured search depth, the process will be repeated for all of the current document’s sub-collections.
   b. If search fields have been configured, the extension will check if the provided fields match the user's UID. If a match is found, the document will be deleted.

#### Search Depth

The extension offers a configurable search depth value (defaulting to 3). Traversal will only be executed if the current search depth is less than or equal to the configuredcurrent search depth. The current search depth is based on the depth of the current collection or documents parent collection, for example

```js
/users = 1
/users/<document-id> = 1
/users/<document-id>/comments = 2
/users/<document-id>/comments/<document-id> = 2
```

This extension will NOT automatically delete UIDs stored in arrays or maps, and it will not search for data keyed by user ID stored in deeply nested subcollections past the depth specified above.

**Note: with large databases, traversal-based discovery may incur many reads and deletions since it reads all documents in the corresponding collections. Please be aware of Cloud Firestore billing prices and how this might impact you. Auto discovery is completely optional.**

## API References:

- [memberships_user_account_added](https://developers.webflow.com/reference/memberships_user_account_added)
- [memberships_user_account_updated](https://developers.webflow.com/reference/memberships_user_account_updated)
