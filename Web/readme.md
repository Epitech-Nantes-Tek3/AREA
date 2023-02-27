![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

# Web

The AREA web client allows you to connect to our work of Action/Reaction.

You can create an account with Facebook or with your e-mail address.

Next you can connect your different accounts to our app (strava, twitch, spotify, ...)

Finally, you can create areas to will allow you to select one action (ex: When it's rainy outside) that will trigger a reaction of your choice (ex: Send me an e-mail)

You can see and remove them on the homescreen. All your active areas are saved on our server and will be automatically triggered by our server even you don't have the app opened on your phone.

## Testing

---

We use Playwright to test our web application.

### Write tests

Our tests are written with codegen, provided with Playwright.

### Pre-requirement

- Have a web navigator
- Build the application: `yarn install && yarn start`
