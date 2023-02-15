/**
 * @constant SpotifyWebApi
 * @module spotify-web-api-node
 */
const SpotifyWebApi = require('spotify-web-api-node');

/**
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


module.exports = {
    /**
     * Callback linked to redirect URI for Spotify
     * Will set the access token and refresh token with the given authorizations
     * @function callBack
     * @param {*} req the request
     * @param {*} res the request's result
     * @returns
     */
    callBack : function (req, res) {
        const error = req.query.error;
        const code = req.query.code;
        const state = req.query.state;

        if (error) {
            console.error('Callback Error:', error);
            res.send(`Callback Error: ${error}`);
            return;
        }

        spotifyApi
            .authorizationCodeGrant(code)
            .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );
            res.send('Success! You can now close the window.');

            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);
            })
            .catch(error => {
            console.error('Error getting Tokens:', error);
            res.send(`Error getting Tokens: ${error}`);
            });
    },

    /**
     * Register a User to spotify, thanks to his client ID and Secret
     * @function registerUser
     * @param {*} req the request
     * @param {*} res the request's result
     */
    registerUser : function (req, res) {
        firebaseFunctions.getDataFromFireBaseServer('Spotify').then(async serverData => {

            spotifyApi.setClientId(serverData.clientID)
            spotifyApi.setClientSecret(serverData.clientSecret)

            res.redirect(spotifyApi.createAuthorizeURL(scopes));
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
     * @param {*} public define whereas the playlist is public or not
     * @param {*} playlistDesc the description of the playlist
     */
    createPlaylist : function(req, res, playlistName, public=true, playlistDesc='') {
        spotifyApi.createPlaylist(playlistName, { 'description': playlistDesc, 'public': public }).then(function(data) {
            console.log('Created playlist ', playlistName);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
    }
}