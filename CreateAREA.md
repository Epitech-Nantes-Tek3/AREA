# How to create an Action/Reaction ?

## Mobile Application

To add an action or a reaction to the mobile app, you have to add it to the file `Application/src/Common/Areas.ts`. The abject should have these values:

```js
export let ACTIONS: InfoArea[] = [
    {
        ...
    },
    {
        serviceName: string, // Name of the service you will be calling, in lowercase
        trigger: boolean, // If it's an action it should be true, else false
        description: string, // Short description of the action or reaction
        text: string | Array<string> | undefined, // Information that will be used by the server, as a song ID for Spotify or a hashtag on Twitter
        subject: string | undefined // Subject of the action or reaction, as 'follows' to know if a user follows an artist, or 'tweet' if you want to make a tweeting reaction.
    },
]
```

## Website

To add an action or a reaction to the website, you have to add it to the file `Web/src/Common/Areas.js`. The abject should have these values:

```js
export let ACTIONS = [
    {
        ...
    },
    {
        serviceName: string, // Name of the service you will be calling, in lowercase
        trigger: boolean, // If it's an action it should be true, else false
        description: string, // Short description of the action or reaction
        text: string | Array<string> | undefined, // Information that will be used by the server, as a song ID for Spotify or a hashtag on Twitter
        subject: string | undefined // Subject of the action or reaction, as 'follows' to know if a user follows an artist, or 'tweet' if you want to make a tweeting reaction.
    },
]
```

## Server

To add an action or a reaction to the server, you have to add it on the appropriate service file, you can find them in `Server/Services/`, modify one of these files to create some action or reactions that aren't implemented yet.

Don't forget to add your action or reaction to the appropriate `Server/Services/description`, that will refresh the /about.json endpoint of the server.
