# Folder structure

Main folder &#x21B4;<br>
--- apps &#x21B4;<br>
------- expo &#x21B4;<br>
------- next &#x21B4;<br>
--- packages &#x21B4;<br>
------- app &#x21B4;<br>
--- [package.json](#packages-and-workspaces)<br>


# Packages and workspaces

The top-level [package.json](./package.json) file essentially defines three workspaces:
1. the **app** workspace, in packages/app
2. the **expo-app** workspace, in apps/expo
3. the **next-app** workspace, in apps/next

## The expo-app workspace

expo &#x21B4;<br>
--- android &#x21B4;<br>
--- ios &#x21B4;<br>
--- App.js<br>
--- index.js<br>
--- app.json<br>
--- babel.config.js<br>
--- metro.config.js<br>
--- package.json<br>

This workspace makes use of the expo framework to compile the app for native platforms. It contains:
1. the main [App](./apps/expo/App.js) component, that loads the [NativeNavigation](./packages/app/navigation/native/index.js) component which is specific to native platforms
2. the configuration files [for expo](./apps/expo/app.json), [metro](./apps/expo/metro.config.js) and [babel](./apps/expo/babel.config.js)
3. its own [package.json](./apps/expo/package.json) file, containing the packages specific to the expo app, i.e. all the expo packages like expo-camera and expo-media-library, some react-native packages, and realm react-native SDK

The android and ios folders contain the result of the compilation of expo for each platform. 

## The next-app workspace

next &#x21B4;<br>
--- pages &#x21B4;<br>
------- budget &#x21B4;<br>
----------- index.js<br>
------- learn &#x21B4;<br>
----------- index.js<br>
------- simulation &#x21B4;<br>
----------- index.js<br>
------- spending &#x21B4;<br>
----------- index.js<br>
------- index.json<br>
------- _app.json<br>
------- _document.json<br>
--- public &#x21B4;<br>
--- .babelrc.json<br>
--- next.config.js<br>
--- package.json<br>

This workspace makes use of the next framework along with expo for web to build a web version of the app. NextJS allows to specify the routing of the web app in a pages folder containing:
1. the MyApp component in [_app.js](./apps/next/pages/_app.js), that loads the WebNavigation component
2. the pages of the app, [index.js](./apps/next/pages/index.js) being the top-level page, accessed on the main route **[domain name]/**, and that displays the [Home](./packages/app/screens/Home/Home.js) component, and the other pages organized in the subfolders, e.g. the [spending page](./apps/next/pages/spending/index.js) is in the spending subfolder, is accessible at **[domain name]/spending** and displays the [Spending](./packages/app/screens/Spending/Spending.js) component
3. its own [packages.json](./apps/next/package.json), with the next-specific packages, including the adapters from expo and native-base
4. the configuration files [for babel](./apps/next/.babelrc.json) and [next](./apps/next/next.config.js), the latter configuring the import rules in order to not import the .js files if their .web.js equivalent exists, allowing to control the components loaded according to if we are running the web app or the native apps

## The app workspace

app &#x21B4;<br>
--- [assets](#assets)/icons &#x21B4;<br>
--- [components](#components) &#x21B4;<br>
--- [hooks](#hooks) &#x21B4;<br>
--- [navigation](#navigation) &#x21B4;<br>
--- [providers](#providers) &#x21B4;<br>
--- [screens](#screens) &#x21B4;<br>
--- [utils](#utils) &#x21B4;<br>
--- index.js<br>
--- [realmApp.js](#realm)<br>
--- [realm.json](#realm)<br>
--- package.json<br>

This workspace is the common code base for the web and native apps. Its [package.json](./packages/app/package.json) contains the common packages needed in both versions of the app, like native-base and solito.

## Assets

The assets/icons folder contains an [index.js](./packages/app/assets/icons/index.js) file, which simply exports all the icons of the @expo/vector-icons package, and an [index.web.js](./packages/app/assets/icons/index.web.js) file, which exports a custom BaseIcon component for each icon family available in @expo/vector-icons. This is a temporary solution needed since this package is not accessible for the web version, a better solution would be to store locally the icons used.

## Components

The components folder contains only pure or composite presentational components. These components should not maintain any state. What the pure components display should only depends on the props given to them. What the composite components display depends on their props and the values they use from preceding providers.

## Screens

This folder contains the screens of the app, which are special presentational components that must correspond to complete screens of the native app, or complete pages of the web app. It should be the only presentational components where links to other screens are explicitly written.

## Navigation

This folder contains the two specific components for navigating the app:
1. NativeNavigation for the native apps, which is a bottom tab navigator allowing to navigate between 5 main screens: home, spending, budget, simulation and learn. Each of these screens is wrapped in its own stack navigator, allowing to navigate to sub screens by remembering the navigation history and being able to come back to previous screens.
2. WebNavigation for the web app, which corresponds to a classic AppBar component containing tabs that link to the 5 main screens.

## Utils

This folder define utility functions, e.g. for date management.

## Providers

This folder contains functionality components, which are components that maintain a part of the app state, and provide their descendants with a context allowing to read that state, along with functions to update it. Among those functions, some are made to be used as a trigger when the user interacts with the layout.

## Hooks

This folder contains custom hooks.

## Realm

The [realmApp.js](./packages/app/realmApp.js) file invokes a unique shared instance of a realm app and exports it. The [realm.json](./packages/app/realm.json) file contains the appID to use, the data source name which is an atlas cluster, and the url to reach it.