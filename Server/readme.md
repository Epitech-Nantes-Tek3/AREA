![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

# Server

The AREA server allows us to handle multiple API routes that will be used by the clients to connect to our software. All the logic is done with Node.js. Concerning our database, we chose to use Firebase.

## API

The different reachable endpoints are marked in our documentation, they are all done with Node.js as we wanted to keep our source code common to our front-end (done with React/React-Native that is a JS framework).

## Firebase

Our database is stored with [Firebase Realtime Database](https://firebase.google.com/docs/database?hl=fr), it allows us to have an online database that can be accessed by any client.
The authentification is also handled with [Firebase Authentification](https://firebase.google.com/docs/auth?hl=fr), as it allows us to connect Facebook and connect users easily.

## Documentation

Generate the documentation based on [this article](https://www.section.io/engineering-education/jsdoc-documentation/).
