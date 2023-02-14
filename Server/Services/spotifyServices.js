const SpotifyWebApi = require('spotify-web-api-node');
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

const spotifyApi = new SpotifyWebApi({
    redirectUri : 'http://localhost:8080/spotify/callback',
    scopes : scopes
});


module.exports = {
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

    registerUser : function (req, res) {
        firebaseFunctions.getDataFromFireBaseServer('Spotify').then(async serverData => {

            spotifyApi.setClientId(serverData.clientID)
            spotifyApi.setClientSecret(serverData.clientSecret)

            res.redirect(spotifyApi.createAuthorizeURL(scopes));
          })
    },
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


    getUser : function (req, res) {
        spotifyApi.pause()
        .then(function() {
            console.log('Playback paused');
        }, function(err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log('Something went wrong!', err);
        });

        res.send('C BO LA VIE')
    }
}