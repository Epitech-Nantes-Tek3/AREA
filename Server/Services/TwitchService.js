/**
 * Twitch module
 * @module Twitch
 */

/**
 * It allows to communicate with the firebase DB.
 * @constant firebaseFunctions
 * @requires firebaseFunctions
 */
const firebaseFunctions = require('../firebaseFunctions')

async function requestApi(data, token, endpoint) {
    let authorizationObject = data;
    let { access_token, expires_in, token_type } = authorizationObject;

    //token_type first letter must be uppercase    
    token_type = token_type.substring(0, 1).toUpperCase() + token_type.substring(1, token_type.length);

    let authorization = `${token_type} ${access_token}`;
    let headers = {
        authorization,
        "Client-Id": token.clientId,
    };
    const res = await fetch(endpoint, { headers });
    const dataTwitch = await res.json();
    return dataTwitch;
}

module.exports = {
    getTwitchAuthorization: function(chanelName) {
        return firebaseFunctions.getDataFromFireBaseServer("Twitch")
        .then(token => {
            let url = `https://id.twitch.tv/oauth2/token?client_id=${token.clientId}&client_secret=${token.clientSecret}&grant_type=client_credentials`;
            return fetch(url, {method: "POST",})
            .then((res) => res.json())
            .then(async(data) => {
                let dataTwitch = await requestApi(data, token, `https://api.twitch.tv/helix/users?login=${chanelName}`);
                return dataTwitch;
            });
        })
        .catch(error => {
            console.error(error)
        })
    }
}



