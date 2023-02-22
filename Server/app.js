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
const spotifyService = require('./Services/spotifyServices')

var passport = require('passport');

const url = require('url');

const session = require('express-session')
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const TWITCH_CLIENT_ID = '1ikfbd316i8dggr27rtl8t9x3qrhvf';
const TWITCH_SECRET    = 'je4r7zf1rwv6jn3q8g0fis4lxrgvc0';
const SESSION_SECRET   = '<YOUR CLIENT SECRET HERE>';
const CALLBACK_URL     = 'http://localhost:8080/auth/twitch/callback';

app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

class TwitchToken {
    constructor(accessToken, refreshToken, uid) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.uid = uid;
    }
}

var twhtokens = new TwitchToken("any", "any", 'none')

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    done(null, profile);
  }
));

app.use(cors());
app.use(express.urlencoded())
//temporaire
const ejs = require('ejs');
const googleService = require('./Services/googleService');
const { ActionTw } = require('./Services/twitterService');
const { Z_FIXED } = require('zlib');
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

nodeCron.schedule("*/10 * * * * *", () => {
    try {
        firebaseFunctions.getAllUsersFromFireBase().then(data => {

            for (const uid in data) {
                try {
                    areasFunctions.areaLoop(uid);
                } catch (err) {
                    console.log(err);
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
})


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
        }, null, 2
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

app.get('/twitch/auth/', function (req, res) {
    if(req.session && req.session.passport && req.session.passport.user) {
      twhtokens.accessToken = req.session.passport.user.accessToken
      twhtokens.refreshToken = req.session.passport.user.refreshToken
      TwitchService.setUserData(twhtokens)
      res.send("BACK TO THE APP NOW")
    } else {
        res.send("l'authentification a échoué")
    }
});

app.post('/twitch/post', (req, res) => {
    twhtokens.uid = req.body.uid
    res.json({body: "OK"}).status(200);
})


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/twitch/auth/', failureRedirect: '/twitch/auth' }));

app.get('/twitch/get', (req, res) => {
    firebaseFunctions.getDataFromFireBaseServer('Twitch').then(serverData => {
        res.json(serverData).status(200);
    })
})

app.get('/twitch/doAct', (req, res) => {
    TwitchService.actionTwitch("stream", firebaseUid, "krl_stream")
    res.send("TWITCH ACT");
})

app.get('/twitter', (req, res) => {
    res.render('index')
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

/// SPOTIFY SERVICES
// CURRENTLY LOGGED WITH Nathan Rousseau Account

// Login
app.get('/spotify', (req, res) => {
    firebaseFunctions.getDataFromFireBaseServer('Spotify').then(serverData => {
        res.json(serverData.clientID).status(200);
    })
})

// Redirect Uri
app.get('/spotify/callback', (req, res) => {
    firebaseFunctions.getDataFromFireBaseServer('Spotify').then(serverData => {
        spotifyService.callBack(req, res, serverData)
    })
})

/// Check if the logged user follow Elvis presley
app.get('/spotify/isfollowing', (req, res) => {
    spotifyService.isfollowing(req, res, ['43ZHCT0cAZBISjO8DG9PnE'])
})

/// Check if the logged user is currently listening some music
app.get('/spotify/islistening', (req, res) => {
    spotifyService.isListening(req, res)
})

/// Check if the user is listening to a specific music (by his name)
app.get('/spotify/islisteningto', (req, res) => {
    spotifyService.isListeningTo(req, res, 'Butterflies and Hurricanes')
})

/// Pause the current music
app.get('/spotify/pause', (req, res) => {
    spotifyService.pauseMusic(req, res)
})

/// Shuffle the playlist or not of the user
app.get('/spotify/wantshuffle', (req, res) => {
    spotifyService.setShuffle(req, res, false)
})

/// Create a new playlist on the logged user
app.get('/spotify/createplaylist', (req, res) => {
    spotifyService.createPlaylist(req, res, 'AreaPlaylist')
})