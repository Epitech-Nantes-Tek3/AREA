const express = require('express');
const app = express();
const config = require('./config');
const cors = require('cors');
var bodyParser = require('body-parser')
const fs = require('fs');
const openMeteoService = require('./Services/openMeteoService');
const twitterService = require('./Services/twitterService');
const TwitchService = require('./Services/TwitchService');
const firebaseFunctions = require('./firebaseFunctions');
const ISSStationService = require('./Services/ISSStationService');
const areasFunctions = require('./Services/areasFunctions');
const firebaseUid = 'leMgZPp8sfe2l06b6TU330bahJz2';
const port = config.port;
const nodeCron = require("node-cron")

const url = require('url');

const session = require('express-session')

app.use(cors());

app.use(session({
    secret:'tmp',
    cookie:{}
}))
app.use(express.urlencoded())
//temporaire
const ejs = require('ejs');
const googleService = require('./Services/googleService');
const { ActionTw } = require('./Services/twitterService');
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello world !')
})

app.get("/testConnexion", (req, res) => {
    res.send("Connexion established").status(200);
})

// nodeCron.schedule("*/10 * * * * *", () => {
//     try {
//         firebaseFunctions.getAllUsersFromFireBase().then(data => {

//             for (const uid in data) {
//                 try {
//                     areasFunctions.areaLoop(uid);
//                 } catch (err) {
//                     console.log(err);
//                 }
//             }
//         })
//     } catch (err) {
//         console.log(err)
//     }
// })


//FIREBASE FUNCTIONS

app.post('/register', (req, res) => {
    firebaseFunctions.register(req, res);
})

app.post('/login', (req, res) => {
    firebaseFunctions.login(req, res);
})

app.post('/resetPassword', (req, res) => {
    firebaseFunctions.resetPassword(req, res)
})

//ABOUT

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
    openMeteoService.GetLocation(firebaseUid)
    .then(data => {
        openMeteoService.WeatherisFineOrNot(data.latitude, data.longitude)
        .then(weatherIsFine => {
            if (weatherIsFine === true)
                console.log('weather is Fine');
            else {
                console.log('weather is Bad');
            }
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });
    res.send('Weather Info')
})

app.post('/register/position', (req, res) => {
    const { latitude, longitude, uid } = req.body;
    var position = {
        latitude: latitude,
        longitude: longitude
    }
    openMeteoService.RegistedRequiredOpenMeteo(res, uid, position)
    ISSStationService.RegistedRequiredIss(res, uid, position)
})

app.post('/register/google', (req, res) => {
    const { uid } = req.body;
    googleService.RegistedRequiredGoogle(uid, res)
})

app.get('/register/iss', (req, res) => {
    ISSStationService.RegistedRequiredIss(res, firebaseUid, data)
})

app.get('/twitch', (req, res) => {
    TwitchService.getTwitchAuthorization(req, res)
})

app.get('/twitch/sign', (req, res) => {
    res.send('Hello twitch!');
})

app.get('/twitch/doAct', (req, res) => {
    token_type = "bearer"
    token_type = token_type.substring(0, 1).toUpperCase() + token_type.substring(1, token_type.length);
    access_token = "6ms23ibr1ae2e52trh6qnxzgo277mt"
    let authorization = `${token_type} ${access_token}`;
    TwitchService.doAct(authorization, "message", "papesan")
    TwitchService.doAct(authorization, "topGames", "Counter-Strike: Global Offensive")
    TwitchService.doAct(authorization, "stream", "gotaga")
    TwitchService.doAct(authorization, "morethan1k", "papesan")
    res.send("TWITCH ACT");
})

app.get('/twitter', (req, res) => {
    res.render('index')
})
//kd189fr4pfww06kkbctba66v016cie




app.get('/tw', (req, res) => {
    twitterService.ActionTw('like', 'chelsea', firebaseUid, req, res)
})

app.get('/twitter/login', (req, res) => {
    twitterService.loginTwitter(req, res)
})

app.get('/twitter/sign', (req, res) => {
    twitterService.signTwitter(req, res)
})

app.get('/twitter/dash', (req, res) => {
    twitterService.dashTwitter(req, res)
})

app.post("/twitter/postTweet", (req, res) => {
    twitterService.sendTweet(req, res)
})

app.post("/twitter/like", (req, res) => {
    twitterService.putlike(req, res)
})

app.post("/twitter/retweet", (req, res) => {
    twitterService.putRetweet(req, res)
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})

app.get('/issStation', (req, res) => {
    if (ISSStationService.checkISSPosition(res, firebaseUid, 1000.0) === true)
        console.log('true');
    else
        console.log('false')
    res.redirect('/')
})

app.get('/areas', (req, res) => {
    areasFunctions.areaLoop(firebaseUid)
    res.send("AREAS")
})

app.post('/register/areas', (req, res) => {
    const { action, reaction, uid, id } = req.body;
    areasFunctions.areaRegister(uid, action, reaction, id)
    res.send('Area registered')
})

app.post('/remove/area', (req, res) => {
    const { uid, id } = req.body;
    console.log(uid, id)
    firebaseFunctions.removeDataFromFireBase(`USERS/${uid}/AREAS/${id}`)
    .then(() => {
        res.json({body: "Success"}).status(200);
    })
    .catch(error => {
        console.log(error);
        res.json(error).status(400);
    })
})

app.get('/getAreas/:uid', (req, res) => {
    const uid  = req.params.uid;
    firebaseFunctions.getDataFromFireBase(uid, 'AREAS')
        .then(data => {
            res.json({areas: data}).status(200);
        })
        .catch(error => {
            console.log(error);
            res.json(error).status(400);
        })
})

app.get('/getPosition/:uid', (req, res) => {
    const uid  = req.params.uid;
    firebaseFunctions.getDataFromFireBase(uid, 'IssStation')
        .then(data => {
            res.json({latitude: data.latitude, longitude: data.longitude}).status(200);
        })
        .catch(error => {
            console.log(error);
            res.json(error).status(400);
        })
})