const SpotifyWebApi = require('spotify-web-api-node');
const firebaseFunctions = require('../firebaseFunctions')

module.exports = {
    registerUser : function () {
        firebaseFunctions.getDataFromFireBaseServer('Spotify').then(serverData => {
            var spotifyApi = new SpotifyWebApi({
                clientId: serverData.clientID,
                clientSecret: serverData.clientSecret
            });

            spotifyApi.clientCredentialsGrant().then(
                function(data) {
                    console.log('The access token is ' + data.body['access_token']);
                    spotifyApi.setAccessToken(data.body['access_token']);

                    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
                        function(data) {
                        console.log('Artist albums', data.body);
                        },
                        function(err) {
                        console.error(err);
                        }
                    );
                },
                function(err) {
                    console.log('Something went wrong when retrieving an access token', err);
                });
        })

    }
}