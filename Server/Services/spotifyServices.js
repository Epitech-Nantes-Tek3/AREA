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

            await res.redirect(spotifyApi.createAuthorizeURL(scopes));

            // spotifyApi.clientCredentialsGrant().then(
            //   function(data) {
            //       console.log('The access token is ' + data.body['access_token']);
            //       spotifyApi.setAccessToken(data.body['access_token']);

            //       // The Logged User
            //       spotifyApi.getMe().then(function(data) {
            //           console.log(data.body);
            //       }, function(err) {
            //           console.log('Something went wrong!', err);
            //       });

            //       /// ELVIS ALBUM
            //       // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
            //       //     function(data) {
            //       //     console.log('Artist albums', data.body);
            //       //     },
            //       //     function(err) {
            //       //     console.error(err);
            //       //     }
            //       // );

            //       //// GET CREEPLACREPE
            //     //   spotifyApi.getUser('92n7d1dfv2dqbtonl88ff5xjf').then(function(data) {
            //     //     console.log('Some information about this user', data.body);
            //     //     }, function(err) {
            //     //     console.log('Something went wrong!', err);
            //     //   });
            //     //   res.send('Réussite')
            //   },
            //   function(err) {
            //       console.log('Something went wrong when retrieving an access token', err);
            //   });
          })
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