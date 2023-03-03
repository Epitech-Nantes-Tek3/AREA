# How to create a Service

## Server

To create a service on the server, you will need to create a new file in `Server/Services` called `{NameOfYourService}Service.js`. Create a module in this file that can be exported. Inside of this module, you will create your different functions. Add your function to register the user's possible ids in the appropriate database path being `USERS/{userUID}/{NameOfYourService}/`.

You also have to create a loop function that allows you to access you different functionnalities with a map `{string, function}` or some `if` statements.

After adding your different functions needed by your service, you have to change the `Server/Services/areasFunctions.js` file :

- Import your newly created module to the file

- Add you main function to the areas object that you can find around line 54, depending on your previous addings.

Before heading to front-end development, you have to create a description json of your newly created service under `Server/Services/description` named `{NameOfYourService}Service.json`, it should have these attributes:

```JSON
{
    "name": string, // Name of your service
    "actions": [
    ], // Actions that are part of your service
    "reactions": [
        {
            "name": string, // Quick description of your reaction
            "description": string // Longer description
        }
    ] // Reactions that are part of your service
}
```

You are now all set server-side !

## Mobile Application

First of all, you can directly add the pure front-end needed to connect to your service (if it's needed) under `Application/src/Screens/SettingsScreen.tsx` around line 488. To do so you will have to insert this line of code:

```tsx
<SingleConnexionBlock
  leftImage={require("../assets/logo/serviceLogo.png")}
  rightImage={require("../assets/arrowRight.png")}
  text={"Text to display"}
  onPress={functionConnectingUser}
/>
```

Your functionConnectingUser should open the default web navigator of the user, allow him to connect and come back to the app. The callback function should send user's ID to the server under `USERS/{userUID}/{NameOfYourService}/id`.

You also have to add your service name in lowercase under `Application/src/Common/Interfaces.ts` in line 14, in InfoArea.serviceName.

Next, you can add your service in `Application/src/Screens/AddArea.tsx` around line 35, it's a map of `{string, NodeRequire}` to have an image for your service.

You are all done !

## Website

First of all, you can directly add the pure front-end needed to connect to your service (if it's needed) under `Web/src/SettingsPage.jsx` around line 405. To do so you will have to insert this line of code:

```jsx
<Service
  image={YourImage}
  service="NameOfYourService"
  onPress={functionConnectingUser}
/>
// YourImage being the image of your service previously imported
```

Your functionConnectingUser should open a popup of the web navigator of the user, allow him to connect and close the popup. The callback function should send user's ID to the server under `USERS/{userUID}/{NameOfYourService}/id`.

Next, you can add your service in `Application/src/Screens/AddArea.tsx` around line 44, it's a map of `{string, NodeRequire}` to have an image for your service.

You are all done !
