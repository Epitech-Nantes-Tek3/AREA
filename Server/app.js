const express = require('express');
const app = express();
const config = require('./config');
var bodyParser = require('body-parser')
const fs = require('fs');

const openMeteoService = require('./Services/openMeteoService');

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

app.get('/about.json', (req, res) => {

    var obj = new Array();
    const dir_path = 'Services/description'
    
    var services_file = fs.readdirSync(dir_path, function(err, items) {
        if (err) {
            console.log(err);
            return;
        }
    })

    for (var i = 0; i < services_file.length; i++) {
        if (services_file[i] == "template.json") {
            continue;
        }
        const data = fs.readFileSync(dir_path + '/' + services_file[i], 'utf8', function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
        })
        obj[i] = JSON.parse(data);
    }

    const about = JSON.stringify(
        {
            "client": {
                "host": req.ip
            },
            "server": {
                "current_time": Date.now(),
                "services": obj
            }
        }
    )
    res.send(about)
})
    
app.get('/weather', (req, res) => {
    openMeteoService.WeatherRainingOrNot(res)
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})