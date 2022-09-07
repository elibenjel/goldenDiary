This app in development is destined to contain the features of the webtool in the firesim repository.
It is designed to run on all platforms (iOS/android/web).
It uses Expo's managed workflow to build the iOS and android version of the app (apps/expo folder), and the NextJS framework to build the web equivalent (apps/next folder). The common codebase is in the packages/app folder.

The app only includes for now a screen to record its daily spending, with the ability to take pictures of the bills associated to each spending, and sort or filter the spending by name, date or amount. The other screens destined to provide the features of the firesim webtool are not yet implemented.

The web version of the app is still in development. The native version is working on simulator or physical device.
The app uses Realm to connect to a realm app and a mongodb atlas cluster, and the native version can work locally when no internet connection is available, and sync with the distant realm. The realm configuration used is stored in the goldenDiaryBackend repository.

## Getting Started

- prerequisites: yarn, and creating an atlas cluster and a realm app with the config in the repo [goldenDiaryBackend](https://github.com/elibenjel/goldenDiaryBackend) (follow the documentation of realm to create one)
- clone this repo
- modify the realm.json file to set the correct appId and appUrl, along with the graphqlEndpoint (all this can be found in the realm web interface, when connected to the app)
- Run `yarn` on the root directory
- Run a simulation of a device, or connect a physical one preconfigured to run an app in development
- Run `yarn android` or `yarn ios` depending on the type of the device

## Doc

More information about the architecture of the repo and the code here:
- [architecture](./architecture.md)
- [code](./skeleton.md)

Credits to Fernando Rojo for its [NativeBase + Solito starter template](https://github.com/GeekyAnts/nativebase-templates/tree/master/solito-universal-app-template-nativebase).
