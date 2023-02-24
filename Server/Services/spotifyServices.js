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
const { resolve } = require('path');

/**
 * Checks if the logged user follows some artists
 * @function isfollowing
 * @param {*} uid the uid of the spotify user
 * @param {*} artistUids the spotify uid of the searched artists (is given as an array for multiples follows)
 * @returns True if the user follows the given artists, False Otherwise
 */
async function isfollowing(uid, artistUids) {
    /// Changer les tokens de spotify API en fonction de l'uid
    /// BONUS : Refresh le token s'il est plus valide (durée 1h)
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        SpotifyWebApi.setAccessToken(data.accessToken)
        SpotifyWebApi.setRefreshToken(data.refreshToken)
        spotifyApi.isFollowingArtists(artistUids).then(function(data) {
        let isFollowing = data.body;

        for (let index = 0; index < artistUidx.length; index++) {
            console.log(artistUids[index] + ':' + isFollowing[index])
        }

        return isFollowing.find(false) === undefined
        }, function(err) {
            console.log('Something went wrong!', err);
            return false
        });
    })
    .catch(error =>{
        console.error(error)
    })
}

/**
 * Checks if the logged user is currently listening to some music
 * @function isListening
 * @param {*} uid the uid of the spotify user
 * @returns True if the user is listening music, False otherwise
 */
async function isListening(uid) {
    /// Changer les tokens de spotify API en fonction de l'uid
    /// BONUS : Refresh le token s'il est plus valide (durée 1h)
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        SpotifyWebApi.setAccessToken(data.accessToken)
        SpotifyWebApi.setRefreshToken(data.refreshToken)
        spotifyApi.getMyCurrentPlaybackState().then(function(data) {
            if (data.body && data.body.is_playing) {
                console.log("User is currently playing something!");
                return true;
            } else {
                console.log("User is not playing anything, or doing so in private.");
                return false;
            }
        }, function(err) {
            console.log('Something went wrong!', err);
            return false;
        });
    })
    .catch(error =>{
        console.error(error)
    })

}

/**
 * Checks if the logged user is listening to a specific music searched by the music name
 * @function isListeningTo
 * @param {*} uid the uid of the spotify user
 * @param {*} musicName the name of the music we're looking for
 * @returns True if the user is listening to musicName, false otherwise
 */
async function isListeningTo(uid, musicName) {
    /// Changer les tokens de spotify API en fonction de l'uid
    /// BONUS : Refresh le token s'il est plus valide (durée 1h)
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        SpotifyWebApi.setAccessToken(data.accessToken)
        SpotifyWebApi.setRefreshToken(data.refreshToken)
        spotifyApi.getMyCurrentPlaybackState().then(function(data) {
            if (data.body && data.body.is_playing) {
                var currMusic = data.body.item.name
                if (currMusic === musicName)
                    return true;
                else {
                    console.log("User is not listening to " + musicName + ", User is listening to " + currMusic)
                    return false;
                }
            } else {
                return false;
            }
        }, function(err) {
            console.log('Something went wrong!', err);
            return false;
        });
    })
    .catch(error =>{
        console.error(error)
    })
}

/**
 * If ther is a music playing, pause it
 * @function pauseMusic
 * @param {*} uid the uid of the spotify user
 * @returns true if the music has been paused, false otherwise
 */
async function pauseMusic(uid) {
    /// Changer les tokens de spotify API en fonction de l'uid
    /// BONUS : Refresh le token s'il est plus valide (durée 1h)
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        SpotifyWebApi.setAccessToken(data.accessToken)
        SpotifyWebApi.setRefreshToken(data.refreshToken)
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
* @function setShuffle
* @param {*} uid the uid of the spotify user
* @returns true if the user track has been shuffled, false otherwise
*/
async function setShuffle(uid) {
    /// Changer les tokens de spotify API en fonction de l'uid
    /// BONUS : Refresh le token s'il est plus valide (durée 1h)
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        SpotifyWebApi.setAccessToken(data.accessToken)
        SpotifyWebApi.setRefreshToken(data.refreshToken)
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
 * @function createPlaylist
 * @param {*} uid the uid of the spotify user
 * @param {*} playlistName__playlistDesc the name and the description of the playlist
 * @returns true if the playlist has been created false otherwise
 */
async function createPlaylist (uid, playlistName__playlistDesc) {
    /// Changer les tokens de spotify API en fonction de l'uid
    /// BONUS : Refresh le token s'il est plus valide (durée 1h)
    firebaseFunctions.getDataFromFireBase(uid, "SpotifyService")
    .then(data => {
        SpotifyWebApi.setAccessToken(data.accessToken)
        SpotifyWebApi.setRefreshToken(data.refreshToken)
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
     * @param {*} serverData client credentials of the developper account
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

            res.send("SUCCESS ! You can go back to the AREA Application.")

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
     * @function SpotifyLoop
     * @param {*} uid uid of the user
     * @param {*} func function chosen by the user
     * @param {*} param playlist name and description on an array or empty string
     * @returns the boolean result of the chosen function
     */
    SpotifyLoop : async function(uid, func, param) {
        return new Promise((resolve, reject) => {
            if (func === "follows") {
                const result = isfollowing(uid, param)
                console.log(result)
                resolve(result)
            } else if (func === "listen") {
                const result = isListening(uid)
                console.log(result)
                resolve(result)
            } else if (func === "listento") {
                const result = isListeningTo(uid, param)
                console.log(result)
                resolve(result)
            }
            else if (func === "createplaylist") {
                const result = createPlaylist(uid, param)
                console.log(result)
                resolve(result)
            } else if (func === "shuffle") {
                const result = setShuffle(uid)
                console.log(result)
                resolve(result)
            } else if (func === "pause") {
                const result = pauseMusic(uid)
                console.log(result)
                resolve(result)
            } else {
                reject(new Error(`Invalid function name: ${func}`));
            }
        })
    }
}