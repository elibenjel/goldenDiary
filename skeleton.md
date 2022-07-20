# App structure

The top level component is the App component of the [native](./apps/expo/App.js) or [web](./apps/next/pages/_app.js) app

App component (native or web)<br>
--- main providers<br>
------- screen component<br>
----------- specific providers<br>
--------------- composite presentational components<br>
------------------- pure presentational component<br>

# Main providers

The main providers provide the app with basic features, such as authentication management. They are always mounted. This is defined in [the index file of the provider folder](./packages/app/provider/index.js).

[NavigationProvider](./packages/app/provider/navigation/index.js)<br>
--- NativeBaseProvider<br>
------- [AuthProvider](./packages/app/provider/authentication/index.js)<br>
----------- [DiaryProvider](./packages/app/provider/api/DiaryProvider.js)<br>

## NavigationProvider

Provide the following values:
1. **push**( route, params ): go to specified route with specified parameters
2. **back**( ): back to previous screen
3. **getRoute**( ): get the current route name
4. **getParams**( ): get the parameters for the current route

In addition, on native platforms, wrap the descendants in a NavigationContainer that is used to configure deep linking for the screens of the app

## NativeBaseProvider

Necessary to use Native Base.

## AuthProvider

Provide the following values:
1. **signUp**( email, password ): create a new user in the realm app
2. **signIn**( email, password ): login a user in the realm app
3. **signOut**( ): logout the current user from the realm app
4. **user**: the current logged in user, or null if there is none

## DiaryProvider

Provide the following values:
1. **diaryActions** (with useDiaryActions hook)
    - **addSpendingCategory**( category ): add the category to the list of spending categories defined by the user
    - **resetSettings**( ): reset the diary settings of the user (i.e. the app general settings) to default values
3. **diary** (with useDiary hook): the diary of the current user, which store the general app settings and other app data related to that user (if user is null, it means that the app is used in local mode, necessarily on a native device, and this diary corresponds to that device)

# Screen Components

A screen component wraps its content, which is composed of composite or pure presentational components, with specific providers (see next section), themselves wrapped in a TopLayout component that defines a basic layout for all screens.

## Spending Screen

TopLayout<br>
--- [Specific providers]<br>
------- [CameraProvider](./packages/app/provider/camera/index.js)<br>
----------- [SpendingHistoryProvider](./packages/app/provider/api/SpendingHistoryProvider.js)<br>
--------------- [Content]<br>

[Content]<br>
--- [SearchBar](./packages/app/components/inputs/SearchBar.js)<br>
--- [SpendingList](./packages/app/)<br>
--- [*Icon*](./packages/app/components/Icon.js)<br>
--- SpendingModal<br>
--- camera.render( )<br>

Use the following provider values:
1. **focus** for the onPress event of the Icon, called without any argument
2. **camera.render** called to render the JSX needed for camera use

# Specific Providers

The specific providers provide their descendants with specific features, such as the use of the camera, or the management of e.g. the spending of the user. They are only mounted at the screen level, therefore only when the mounted screen needs them.

## CameraProvider

Needs the following props:
1. **saveDir**: in which directory the picture taken should be saved (this depends on the screen that renders)

Maintain the following states:
1. **show**: if we must show the Camera component
2. **hasCameraPermissions**: if the app has the right to use the camera
3. **saveDirExists**: if the save directory exists
4. **cameraReady**: if the camera device is ready to take a picture
5. **photo**: the current photo that has just been taken, or undefined if there is none
6. **onSaveSuccessRef**: ref to the function to execute after a successful save

Provide the following values:
1. **camera** (with the useCamera hook)
    - **show**
    - **trigger**( ): to trigger the display of the Camera component
    - **renderCamera**( ):
        - if show is false, returns nothing
        - if show is true but the current photo is undefined, returns the JSX to render the Camera component (however if we don't have permissions to use camera, returns dialog to tell the user to change it in the settings)
        - otherwise, returns the JSX to visualize the photo taken and decide to save it to disk or not
    - **onSaveSuccess**( f ): bind f to onSaveSuccessRef

## SpendingHistoryProvider

SpendingHistoryContext.Provider<br>
--- children<br>
--- *ModalConfirmation*<br>

Maintain the following states:
1. **focusedSpending**:
    - undefined if there is none
    - null if the user wants to create a new one
    - otherwise, the spending the user wants to modify
2. **userInputs**: object keeping track of the new values the user wants to give to the spending they are modifying/creating
3. **formattingOptions**: object to keep track of the display options the user wants for the history of spendings (sort, filter, group, search)
4. **spendingHistory**: the formatted list of spending to show to the user
5. **spendingToDelete**: set to the spending the user wants to delete, in which case ModalConfirmation is opened to cancel or validate the operation, or undefined otherwise

Keep the following refs:
1. **rawSpendingRef**: all the spendings related to this user, unformatted
2. **realmRef**: the realm used to read/write spending data

Use the following provider values:
1. **diary**: from DiaryProvider, needed to know the default currency of the current user when creating a new spending
2. **user**: from AuthProvider, needed to know which spending we can read/write
3. **diaryActions.addSpendingCategory** called in the submit function provided to descendants if the user did input a new spending category

Provide the following values:
1. **spendingHistory** (with useSpendingHistory hook)
    - **value**: **spendingHistory**
    - **format**( newOptions ): allow to format the spendingHistory with new options (sort, filter, group, search)
    - **formattingOptions**
3. **spendingActions** (with useSpendingActions hook)
    - **focused**: **focusedSpending**
    - **userInputs**
    - **setters**: object of setters for various data fields of a spending (setName, setDate, setBills, etc...)
    - **submit**( ): create a new spending with the current focusedSpendingChanges if the focusedSpending is null, or update the focusedSpending if it already exists
    - **delete**( spending ): set spendingToDelete to the one given in argument
    - **focus**( spending ): focus the spending given in argument, or set focusedSpending to null if no argument is given
    - **blur**( ): set focusedSpending to undefined

# Composite Presentational Components

These are components that do not maintain any state, although making use of one or more values coming from one or more providers. They are generally composed of other composite presentational components, or pure presentational components.

## SearchBar

[Content]<br>
--- [*FormControlledTextField*](./packages/app/components/inputs/FormControlledTextField.js)<br>
--- *OptionMenu* [2]<br>
--- *OptionMenu* [3]<br>

Use the following provider values:
1. **spendingHistory.formattingOptions**
    - **search** as a prop for [1]
    - **filter** as a prop for [2]
    - **group** as a prop for [2]
    - **sort** as a prop for [3]
2. **spendingHistory.format** called as onPress event of [1], [2] and [3]

## SpendingList

[Content]<br>
--- SpendingCard[]<br>

Use the following provider values:
1. **spendingHistory.value** to loop over the spending to show them

## SpendingCard

[Content]<br>
--- *Pressable*<br>
------- *Icon*<br>
------- *Text* [1]<br>
------- *Text* [2]<br>
------- *Text* [3]<br>
------- *Text* [4]<br>

Needs the following props:
1. **spending**: the spending name, date, amount and category to display by the Text components

Use the following provider values:
1. **spendingActions.focus** for the onPress event of the Pressable wrapper
2. **spendingActions.delete** for the onPress event of the Icon

## SpendingModal

[Content]<br>
--- *Modal*<br>
------- *FormControlledTextField* [1]<br>
------- *FormControlledTextField* [2]<br>
------- *FormControlledSelect*<br>
------- *FormControlledTextField* [3]<br>
------- *Icon* [1]<br>
------- *FormControlledDatePicker*<br>
------- *FormControlledImage*<br>
------- *Icon* [2]<br>
------- *Button* [1]<br>
------- *Button* [2]<br>

Use the following provider values:
1. **spendingActions.focused** to know if the Modal must be opened or not (not if undefined)
2. **spendingActions.userInputs** to keep track of the values to display in the FormConctrolled components
3. **spendingActions.setters** for the change events of those components
4. **spendingActions.submit** for the onPress event of Button [2]
5. **spendingActions.blur** called after submit, or as the onPress event of Button [1]
6. **camera.trigger** for the onPress event of Icon
