/**
 * SpotifyService module
 * @module SpotifyService
 */

/**
 * It allows to use spotify web api node
 * @constant SpotifyWebApi
 * @requires spotify-web-api-node
 */
const SpotifyWebApi = require('spotify-web-api-node');

/**
 * It allows to use firebaseFunctions.
 * @constant firebaseFunctions
 * @requires firebaseFunctions
 */
const firebaseFunctions = require('../firebaseFunctions')

/**
 * All the scopes needed to run the spotify api
 * @constant scopes
 * @requires scopes
 */
const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];

/**
 * @constant spotifyApi
 * Will be used for all spotify actions related with the @constant scopes authorizations
 * */
const spotifyApi = new SpotifyWebApi({
    redirectUri : 'http://localhost:8080/spotify/callback',
    scopes : scopes
});

/**
 * It is required to send requests
 * @var request
 * @requires request
 */
var request = require('request');

/**
 * It allows to create url from parameters
 * @constant querystring
 * @requires querystring
 */
const querystring  = require('querystring');

/**
 * Checks if the logged user follows some
 * @async
 * @function isfollowing
 * @param {*} uid the uid of the spotify user
 * @param {*} artistUids the spotify uid of the searched artists (is given as an array for multiples follows)
 * @returns True if the user follows the given artists, False Otherwise
 */
async function isfollowing(uid, artistUids) {
    return new Promise ((resolve, reject) => {
        firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
        .then(data => {
            spotifyApi.setAccessToken(data.accessToken)
            spotifyApi.setRefreshToken(data.refreshToken)
            if (typeof(artistUids) !== Array)
                artistUids = [artistUids]
            spotifyApi.isFollowingArtists(artistUids).then(function(data) {
            let isFollowing = data.body;

            for (let index = 0; index < artistUids.length; index++) {
                console.log(artistUids[index] + ':' + isFollowing[index])
            }

            resolve(!isFollowing.includes(false))
            }, function(err) {
                console.log('Something went wrong!', err);
                resolve(false)
            });
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })
}

/**
 * Checks if the logged user is currently listening to some music
 * @async
 * @function isListening
 * @param {*} uid the uid of the spotify user
 * @returns True if the user is listening music, False otherwise
 */
async function isListening(uid) {
    return new Promise ((resolve, reject) => {
         firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
        .then(data => {
            spotifyApi.setAccessToken(data.accessToken)
            spotifyApi.setRefreshToken(data.refreshToken)
            spotifyApi.getMyCurrentPlaybackState().then(function(data) {
                if (data.body && data.body.is_playing) {
                    console.log("User is currently playing something!");
                    resolve(true);
                } else {
                    console.log("User is not playing anything, or doing so in private.");
                    resolve(false);
                }
            }, function(err) {
                console.log('Something went wrong!', err);
                resolve(false);
            });
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })

}

/**
 * Checks if the logged user is listening to a specific music searched by the music name
 * @async
 * @function isListeningTo
 * @param {*} uid the uid of the spotify user
 * @param {*} musicName the name of the music we're looking for
 * @returns True if the user is listening to musicName, false otherwise
 */
async function isListeningTo(uid, musicName) {
    return new Promise ((resolve, reject) => {
        firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
        .then(data => {
            spotifyApi.setAccessToken(data.accessToken)
            spotifyApi.setRefreshToken(data.refreshToken)
            spotifyApi.getMyCurrentPlaybackState().then(function(data) {
                if (data.body && data.body.is_playing) {
                    var currMusic = data.body.item.name
                    if (currMusic === musicName)
                        resolve(true);
                    else {
                        console.log("User is not listening to " + musicName + ", User is listening to " + currMusic)
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            }, function(err) {
                console.log('Something went wrong!', err);
                resolve(false);
            });
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })
}

/**
 * If ther is a music playing, pause
 * @async
 * @function pauseMusic
 * @param {*} uid the uid of the spotify user
 * @returns true if the music has been paused, false otherwise
 */
async function pauseMusic(uid) {
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        spotifyApi.setAccessToken(data.accessToken)
        spotifyApi.setRefreshToken(data.refreshToken)
        spotifyApi.pause().then(function() {
            console.log("Music Paused !")
            return true;
        }, function(err) {
            console.log('Something went wrong!', err)
            return false;
        });
    })
    .catch(error =>{
        console.error(error)
    })
}

/**
* Set the shuffle mode to on or off, corresponding to want shuffle
* The logged user should listen to music, or it can lead to undefined behavior
* @async
* @function setShuffle
* @param {*} uid the uid of the spotify user
* @returns true if the user track has been shuffled, false otherwise
*/
async function setShuffle(uid) {
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        spotifyApi.setAccessToken(data.accessToken)
        spotifyApi.setRefreshToken(data.refreshToken)
        spotifyApi.setShuffle(true).then(function() {
            console.log('Succes')
            return true;
        }, function  (err) {
            console.log('Something went wrong!', err);
            return false;
        });
    })
    .catch(error =>{
        console.error(error)
    })
}

/**
 * Sets the user data in the Firebase database.
 * @function setUserDataSpotify
 * @param {Object} SpotifyTokens - An object containing the Spotify API access and refresh tokens, as well as the user ID.
 */
function setUserDataSpotify(SpotifyTokens) {
    let tokens = {
        accessToken : SpotifyTokens.accessToken,
        refreshToken : SpotifyTokens.refreshToken,
    }
    firebaseFunctions.setDataInDb(`USERS/${SpotifyTokens.uid}/SpotifyService`, tokens)
}

/**
 * Create a new playlist for the logged user
 * @async
 * @function createPlaylist
 * @param {*} uid the uid of the spotify user
 * @param {*} playlistName__playlistDesc the name and the description of the playlist
 * @returns true if the playlist has been created false otherwise
 */
async function createPlaylist (uid, playlistName__playlistDesc) {
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        spotifyApi.setAccessToken(data.accessToken)
        spotifyApi.setRefreshToken(data.refreshToken)
        const paramArray = playlistName__playlistDesc.split("__")
        const playlistName = paramArray[0];
        const playlistDesc = paramArray[1];
        spotifyApi.createPlaylist(playlistName, { 'description': playlistDesc, 'public': true }).then(function(data) {
            console.log('Created playlist ', playlistName);
            return true;
        }, function(err) {
            console.log('Something went wrong!', err);
            return false;
        });
    })
    .catch(error =>{
        console.error(error)
    })
}

module.exports = {
    /**
     * Callback linked to redirect URI for Spotify
     * Will set the access token and refresh token with the given authorizations
     * @function callBack
     * @param {*} req the request
     * @param {*} res the request's result
     * @param {*} serverData client credentials of the developper
     * @param {*} SpotifyTokens object containing the tokens and the uid of the user
     */
    callBack : function (req, res, serverData, SpotifyTokens) {
        var code = req.query.code || null;
        var state = req.query.state || null;

        if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
            error: 'state_mismatch'
            }));
        } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
            code: code,
            redirect_uri: 'http://localhost:8080/spotify/callback',
            grant_type: 'authorization_code'
            },
            headers: {
            'Authorization': 'Basic ' + (new Buffer(serverData.clientID + ':' + serverData.clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

            var access_token = body.access_token,
                refresh_token = body.refresh_token;
            SpotifyTokens.accessToken = access_token
            SpotifyTokens.refreshToken = refresh_token
            setUserDataSpotify(SpotifyTokens)
            spotifyApi.setAccessToken(access_token)
            spotifyApi.setRefreshToken(refresh_token)

            res.send("SUCCESS ! You can go back to the AREA Application.\n The access token will only last one hour.")

            } else {
            res.redirect('/#' +
                querystring.stringify({
                error: 'invalid_token'
                }));
            }
        });
        }
    },

    /**
     * Register a User to spotify, thanks to his client ID and Secret
     * @function registerUser
     * @param {*} req the request
     * @param {*} res the request's result
     * @return the needed credentials to register the user
     */
    registerUser : function (req, res) {
        firebaseFunctions.getDataFromFireBaseServer('Spotify').then(serverData => {
            return serverData;
        })
    },
    /**
     * @async
     * @function SpotifyLoop
     * @param {*} uid uid of the user
     * @param {*} func function chosen by the user
     * @param {*} param playlist name and description on an array or empty string
     * @returns the boolean result of the chosen function
     */
    SpotifyLoop : async function(uid, func, param) {
        return new Promise(async (resolve, reject) => {
            if (func == "follows") {
                const result = await isfollowing(uid, param)
                console.log(result)
                resolve(result)
            } else if (func == "listen") {
                const result = await isListening(uid)
                console.log(result)
                resolve(result)
            } else if (func == "listento") {
                const result = await isListeningTo(uid, param)
                console.log(result)
                resolve(result)
            } else if (func == "createplaylist") {
                const result = await createPlaylist(uid, param)
                console.log(result)
                resolve(result)
            } else if (func == "shuffle") {
                const result = await setShuffle(uid)
                console.log(result)
                resolve(result)
            } else if (func == "pause") {
                const result = await pauseMusic(uid)
                console.log(result)
                resolve(result)
            } else {
                reject(new Error(`Invalid function name: ${func}`));
            }
        })
    }
}