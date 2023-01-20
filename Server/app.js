const express = require('express');
const app = express();
const config = require('./config');
var bodyParser = require('body-parser')

const port = config.port;

const firebase = require("firebase");

const firebaseConfig = require('./firebaseConfig');

firebase.initializeApp(firebaseConfig.api);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  firebase.auth()
  .createUserWithEmailAndPassword(email, password).then((userCredential) => {
    console.log('Successfully created new user:', userCredential.user.uid)
    res.sendStatus(200);
  }).catch((error) => {
    console.log('Error creating new user:', error);
    res.send(error).status(400);
  });
})

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
    console.log('User signed in:', userCredential.user.uid);
    res.sendStatus(200)
  }).catch((error) => {
    console.log('Error at the sign in:', error);
    res.send(error).status(400);
  })
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})