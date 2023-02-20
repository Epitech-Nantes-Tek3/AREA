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

module.exports = {
    /**
     * Callback linked to redirect URI for Spotify
     * Will set the access token and refresh token with the given authorizations
     * @function callBack
     * @param {*} req the request
     * @param {*} res the request's result
     * @param {*} serverData client credentials of the developper account
     */
    callBack : function (req, res, serverData) {
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
     * Checks if the logged user follows some artists
     * @function isfollowing
     * @param {*} req the request
     * @param {*} res the request's result
     * @param {*} artistUid the spotify uid of the searched artists
     */
    isfollowing : function (req, res, artistUid) {
        spotifyApi.isFollowingArtists(artistUid).then(function(data) {
            let isFollowing = data.body;

            for (let index = 0; index < artistUid.length; index++) {
                console.log(artistUid[index] + ':' + isFollowing[index])
            }

            res.send(isFollowing)
        }, function(err) {
            console.log('Something went wrong!', err);
        });
    },
    /**
     * Checks if the logged user is currently listening to some music
     * @function isListening
     * @param {*} req the request
     * @param {*} res the request's result
     */
    isListening : function (req, res) {
        spotifyApi.getMyCurrentPlaybackState().then(function(data) {
            if (data.body && data.body.is_playing) {
                res.send("User is currently playing something!");
            } else {
                res.send("User is not playing anything, or doing so in private.");
            }
        }, function(err) {
            console.log('Something went wrong!', err);
        });

    },
    /**
     * Checks if the logged user is listening to a specific music searched by the music name
     * @function isListeningTo
     * @param {*} req the request
     * @param {*} res the request's result
     * @param {*} musicName the name of the music we're looking for
     */
    isListeningTo : function (req, res, musicName) {
        spotifyApi.getMyCurrentPlaybackState().then(function(data) {
            if (data.body && data.body.is_playing) {
                var currMusic = data.body.item.name
                if (currMusic === musicName)
                    res.send("User is listening to : " + musicName)
                else
                    res.send("User is not listening to " + musicName + ", User is listening to " + currMusic)
            } else {
                res.send("User is not playing anything, or doing so in private.");
            }
        }, function(err) {
            console.log('Something went wrong!', err);
        });

    },

    /**
     * If ther is a music playing, pause it
     * @function pause
     * @param {*} req the request
     * @param {*} res the request's result
     */
    pauseMusic : function (req, res) {
        spotifyApi.pause().then(function() {
            res.send("Music Paused !")
        }, function(err) {
            console.log('Something went wrong!', err)
        });
    },

    /**
     * Set the shuffle mode to on or off, corresponding to want shuffle
     * The logged user should listen to music, or it can lead to undefined behavior
     * @function setShuffle
     * @param {*} req the request
     * @param {*} res the request's result
     * @param {*} wantShuffle if true, the shuffle will be on, otherwise it will be off
     */
    setShuffle : function(req, res, wantShuffle) {
        spotifyApi.setShuffle(wantShuffle).then(function() {
          res.send('Succes')
        }, function  (err) {
          console.log('Something went wrong!', err);
        });
    },

    /**
     * Create a new playlist for the logged user
     * @function createPlaylist
     * @param {*} req the request
     * @param {*} res the request's result
     * @param {*} playlistName the name of the playlist
     * @param {*} isPublic define whereas the playlist is public or not
     * @param {*} playlistDesc the description of the playlist
     */
    createPlaylist : function(req, res, playlistName, isPublic=true, playlistDesc='') {
        spotifyApi.createPlaylist(playlistName, { 'description': playlistDesc, 'public': isPublic }).then(function(data) {
            console.log('Created playlist ', playlistName);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
    }
}