# Extensions

This project contains the source for SimplyCubed Extensions. Created and tested by SimplyCubed, these unofficial extensions are reliable and secure. To learn more about Firebase Extensions, including how to install them in your Firebase projects, visit the [Firebase documentation](https://firebase.google.com/docs/extensions).

Each directory in this repo contains the source code for the extension and a README to explain how the extension works, including information about the APIs enabled, resources created, and the access granted to the extension.

When you find an extension that solves a need for your app or project, all you do is install and configure the extension. With extensions, you don't spend time researching, writing, and debugging the code that implements functionality or automates a task for your app or project.

You can also browse official Firebase extensions from the following sources:

- [Firebase Extensions product page](https://firebase.google.com/products/extensions)
- [Firebase Extensions dashboard](https://console.firebase.google.com/project/_/extensions/) in the Firebase console
  You can also browse official Firebase extensions on the [Extensions Marketplace](https://extensions.dev).

[![SimplyCubed Extensions: Starter Kits](starter-kits.png)](https://webevents.dev/)

## Running tests

Running `npm run test:emulator` will spwan firebase emulator and run tests inside it.
You can also run the emulator separately (`npm run local:emulator`) and then run tests using `npm run test`.

## Publishing

1. After a PR is merged, publish pipeline automatically updates the versions (along with extension.yaml and CHANGELOG.md) and creates releases on github.
2. Once releases are created, extensions can be published (done manually) using the command:

```bash
firebase ext:dev:publish simplycubed/$extension-name --repo=https://github.com/simplycubed/extensions --root=$extension-name --ref=$extension-release-tag
```

eg:

```bash
firebase ext:dev:publish simplycubed/rtdb-webflow-sync --repo=https://github.com/simplycubed/extensions --root=rtdb-webflow-sync --ref=rtdb-webflow-sync@0.2.4
```

## License

This project is licensed under Apache 2.0.  
Full license text is available in [LICENSE](LICENSE).

## Disclaimer

This package is not an official Google Firebase or Webflow product. It is an open-source project supported by SimplyCubed.
