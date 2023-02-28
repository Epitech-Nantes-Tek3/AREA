/**
 * APP module
 * @module APP
 */

/**
 * @constant express
 * @requires express
*/
const express = require('express');

/**
 * @constant app
 * @requires app
*/
const app = express();

/**
 * @constant config
 * @requires config
*/
const config = require('./config');

/**
 * @constant cors
 * @requires cors
*/
const cors = require('cors');

/**
 * @constant bodyParser
 * @requires bodyParser
*/
var bodyParser = require('body-parser')

/**
 * @constant fs
 * @requires fs
*/
const fs = require('fs');

/**
 * @constant openMeteoService
 * @requires openMeteoService
*/
const openMeteoService = require('./Services/openMeteoService');

/**
 * @constant twitterService
 * @requires twitterService
*/
const twitterService = require('./Services/twitterService');

/**
 * @constant TwitchService
 * @requires TwitchService
*/
const TwitchService = require('./Services/TwitchService');

/**
 * @constant firebaseFunctions
 * @requires firebaseFunctions
*/
const firebaseFunctions = require('./firebaseFunctions');

/**
 * @constant ISSStationService
 * @requires ISSStationService
*/
const ISSStationService = require('./Services/ISSStationService');

/**
 * @constant areasFunctions
 * @requires areasFunctions
*/
const areasFunctions = require('./Services/areasFunctions');

/**
 * @constant port
 * @requires config.port
*/
const port = config.port;

/**
 * @constant nodeCron
 * @requires node-cron
*/
const nodeCron = require("node-cron")

/**
 * @constant spotifyServices
 * @requires spotifyServices
*/
const spotifyService = require('./Services/spotifyServices')

/**
 * @constant passport
 * @requires passport
*/
var passport = require('passport');

/**
 * @constant session
 * @requires session
*/
const session = require('express-session')

/**
 * @constant session
 * @requires (passport-oauth').OAuth2Strategy
*/
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

/**
 * @constant TWITCH_CLIENT_ID
 * @requires TWITCH_CLIENT_ID
*/
const TWITCH_CLIENT_ID = '1ikfbd316i8dggr27rtl8t9x3qrhvf';

/**
 * @constant TWITCH_SECRET
 * @requires TWITCH_SECRET
*/
const TWITCH_SECRET    = 'je4r7zf1rwv6jn3q8g0fis4lxrgvc0';

/**
 * @constant SESSION_SECRET
 * @requires SESSION_SECRET
*/
const SESSION_SECRET   = '<YOUR CLIENT SECRET HERE>';

/**
 * @constant CALLBACK_URL
 * @requires CALLBACK_URL
*/
const CALLBACK_URL     = 'http://localhost:8080/auth/twitch/callback';

/**
 * session & passport required for twitch service
*/
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * @class class which contains the access token & refresh token, and the user's uid.
 */
class TwitchToken {
    constructor(accessToken, refreshToken, uid) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.uid = uid;
    }
}

/**
 * @class class containing the access token and refresh token, with the user uid for spotify api
 */
class SpotifyToken {
    constructor(accessToken, refreshToken, uid) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.uid = uid;
    }
}
/**
* @var SpotifyTokens
* @requires SpotifyToken()
*/
var SpotifyTokens = new SpotifyToken("any", "any", 'none')

/**
 * @var twhtokens
 * @requires TwitchToken()
*/
var twhtokens = new TwitchToken("any", "any", 'none')

/**
 * passport required for twitch service
*/
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


/**
 * initialisation of cors in app.
*/
app.use(cors());
/**
 * initialisation of express.urlencoded() in app.
*/
app.use(express.urlencoded())

//temporaire
/**
 * @constant ejs
 * @requires ejs
*/
const ejs = require('ejs');
/**
 * @constant googleService
 * @requires googleService
*/
const googleService = require('./Services/googleService');

/**
 * initialisation of ejs for twitch authentification.
*/
app.set('view engine', 'ejs');


/**
 * parse application/x-www-form-urlencoded
*/
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * parse application/json
*/
app.use(bodyParser.json())

/**
 * @method get
 * @function '/' Server HomePage
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.get('/', (req, res) => {
    res.redirect("/about.json")
})

/**
 * @method get
 * @function '/testConnexion' Server HomePage
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.get("/testConnexion", (req, res) => {
    res.send("Connexion established").status(200);
})

/**
 * @function nodeCron.schedule nodeCron.schedule("*10 * * * * *")
*/
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

/**
 * @method post
 * @function '/register' Server register page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/register', (req, res) => {
    firebaseFunctions.register(req, res);
})

/**
 * @method post
 * @function '/login' Server login page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/login', (req, res) => {
    firebaseFunctions.login(req, res);
})

/**
 * @method post
 * @function '/resetPassword' Server reset password page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/resetPassword', (req, res) => {
    firebaseFunctions.resetPassword(req, res)
})

/**
 * @method get
 * @function '/about.json' Server about page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
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

    const d = new Date()
    const about = JSON.stringify(
        {
            "client": {
                "host": req.ip
            },
            "server": {
                "current_time": d.toString(),
                "services": obj
            }
        }
    )
    res.send(JSON.parse(about))
})

/**
 * call the RegistedRequiredOpenMeteo & RegistedRequiredIss to register OpenMétéo & Iss data for the user.
 * @method post
 * @function '/register/position' Server register position page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/register/position', (req, res) => {
    const { latitude, longitude, uid } = req.body;
    var position = {
        latitude: latitude,
        longitude: longitude
    }
    openMeteoService.RegistedRequiredOpenMeteo(uid, position)
    ISSStationService.RegistedRequiredIss(uid, position)
})

/**
 * call the RegistedRequiredGoogle to register google data for the user.
 * @method post
 * @function '/register/google' Server register google page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/register/google', (req, res) => {
    const { uid } = req.body;
    googleService.RegistedRequiredGoogle(uid, res)
})

/**
 * Set twitch user data to passport and setUserData to DB.
 * @method get
 * @function '/twitch/auth/' Server twitch authentification page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
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

/**
 * Get the user id and set in the class twhtokens.
 * @method post
 * @function '/twitch/post/' Server twitch post page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/twitch/post', (req, res) => {
    twhtokens.uid = req.body.uid
    res.json({body: "OK"}).status(200);
})

/**
 * call serializeUser from the passport.
*/
passport.serializeUser(function(user, done) {
    done(null, user);
});

/**
 * call deserializeUser from the passport.
*/
passport.deserializeUser(function(user, done) {
    done(null, user);
});

/**
 * Get the callback from twitch API and redirect to /twitch/auth/
 * @method get
 * @function '/auth/twitch/callback'' Server twitch callback page
*/
app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/twitch/auth/', failureRedirect: '/twitch/auth' }));

/**
 * return twitch information to the front.
 * @method get
 * @function '/twitch/get' Server twitch get page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.get('/twitch/get', (req, res) => {
    firebaseFunctions.getDataFromFireBaseServer('Twitch').then(serverData => {
        res.json(serverData).status(200);
    })
})

/**
 * return twitter information to the front.
 * @method get
 * @function '/twitter/get' Server twitter get page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.get('/twitter/get', (req, res) => {
    firebaseFunctions.getDataFromFireBaseServer('twitter').then(serverData => {
        res.json(serverData).status(200);
    })
})

/**
 * Twitter login page use loginTwitter
 * @method post
 * @function '/twitter/login' Server twitter login page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/twitter/login', (req, res) => {
    twitterService.loginTwitter(req, res, req.body.params)
})

/**
 * Twitter sign page use signTwitter
 * @method get
 * @function '/twitter/sign' Server twitter sign page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.get('/twitter/sign', (req, res) => {
    twitterService.signTwitter(req, res)
})

/**
 * listening on port
 * @method listen
*/
app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})

/**
 * register areas page use areaRegister
 * @method post
 * @function '/register/areas' Server register areas page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/register/areas', (req, res) => {
    const { action, reaction, uid, id } = req.body;
    areasFunctions.areaRegister(uid, action, reaction, id)
    res.send('Area registered')
})

/**
 * remove areas page use removeDataFromFireBase
 * @method post
 * @function '/register/areas' Server remove areas page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/remove/area', (req, res) => {
    const { uid, id } = req.body;
    firebaseFunctions.removeDataFromFireBase(`USERS/${uid}/AREAS/${id}`)
    .then(() => {
        res.json({body: "Success"}).status(200);
    })
    .catch(error => {
        console.log(error)
        res.json(error).status(400);
    })
})

/**
 * Send areas for 1 uid to the front.
 * @method get
 * @function '/getAreas/:uid' Server getAreas page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
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

/**
 * Send position for 1 uid to the front.
 * @method get
 * @function '/getPosition/:uid' Server getPosition page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
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

/**
 * Login Page
 * @method get
 * @function '/spotify' Server spotify page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.get('/spotify', (req, res) => {
    firebaseFunctions.getDataFromFireBaseServer('Spotify').then(serverData => {
        res.json(serverData.clientID).status(200);
    })
})

/**
 * Get the user id and set in the class SpotifyTokens.
 * @method post
 * @function '/twitch/post/' Server Spotify post page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.post('/spotify/post', (req, res) => {
    SpotifyTokens.uid = req.body.uid
    res.json({body: "OK"}).status(200);
})

/**
 * Spotify callback page use callBack function.
 * @method get
 * @function '/spotify/callback' Server spotify callback page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
*/
app.get('/spotify/callback', (req, res) => {
    firebaseFunctions.getDataFromFireBaseServer('Spotify').then(serverData => {
        spotifyService.callBack(req, res, serverData, SpotifyTokens)
    })
})