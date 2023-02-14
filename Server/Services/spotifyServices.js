const SpotifyWebApi = require('spotify-web-api-node');
const firebaseFunctions = require('../firebaseFunctions')

module.exports = {
    registerUser : function (req, res) {
        firebaseFunctions.getDataFromFireBaseServer('Spotify').then(serverData => {
            var spotifyApi = new SpotifyWebApi({
                clientId: serverData.clientID,
                clientSecret: serverData.clientSecret,
                redirectUri : 'http://localhost:8080/spotify'
            });

            spotifyApi.clientCredentialsGrant().then(
              function(data) {
                  console.log('The access token is ' + data.body['access_token']);
                  spotifyApi.setAccessToken(data.body['access_token']);

                  /// The Logged User
                  // spotifyApi.getMe().then(function(data) {
                  //     console.log(data.body);
                  // }, function(err) {
                  //     console.log('Something went wrong!', err);
                  // });

                  /// ELVIS ALBUM
                  // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
                  //     function(data) {
                  //     console.log('Artist albums', data.body);
                  //     },
                  //     function(err) {
                  //     console.error(err);
                  //     }
                  // );

                  /// GET CREEPLACREPE
                  // spotifyApi.getUser('92n7d1dfv2dqbtonl88ff5xjf').then(function(data) {
                  //   console.log('Some information about this user', data.body);
                  //   }, function(err) {
                  //   console.log('Something went wrong!', err);
                  // });
                  res.send('Réussite')
              },
              function(err) {
                  console.log('Something went wrong when retrieving an access token', err);
              });
          })

    }
}