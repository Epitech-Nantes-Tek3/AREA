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


/**
 * Scopes requires for actions reactions.
 * @constant scopes
 * @requires scopes
 */
const scopes = [
    "analytics:read:extensions",
    "analytics:read:games",
    "moderator:read:followers",
    "channel:manage:moderators",
    "channel:manage:predictions",
    "channel:manage:polls",
    "user:manage:whispers"
].join(" ");

/**
 * Required variable use in authentification
 * @constant response_type
 * @requires response_type
 */
const response_type = "token"

/**
 * Required url, given by dev.twitch.tv
 * @constant twitch_oauth_url
 * @requires twitch_oauth_url
 */
const twitch_oauth_url = "https://id.twitch.tv/oauth2/authorize"

/**
 * Gets the elements of the url and encodes them to work with "éàè..." characters
 * @function encodeQueryString
 * @param {*} params params contains the elements to be added to the url.
 */
function encodeQueryString(params) {
    const queryString = new URLSearchParams();
    for (let paramName in params) {
        queryString.append(paramName, params[paramName]);
    }
    return queryString.toString();
}

/**
 * Check if the Top Twich game is the same as the one selected by the user
 * @function checkTopGames
 * @param {String} uid uid of the user
 * @param {String} games Games selected by the user
 */
function checkTopGames(uid, game) {
    firebaseFunctions.getDataFromFireBase(uid, "Twitch")
    .then(async clientToken => {
        let headers = {
            "Authorization": clientToken.authorization,
            "Client-Id": clientToken.clientId,
        };
        OriginUrl = "https://api.twitch.tv/helix/games/top"
        const res = await fetch(OriginUrl, { headers });
        const dataTwitch = await res.json();
        if (dataTwitch.data[0].name == game) {
            console.log("true top games is", game);
            return true;
        } else {
            console.log("false top game is", dataTwitch.data[0].name);
            return false;
        }
    })
    .catch(error => {
        console.log(error);
    });
}

/**
 * See if the chosen streamer is live or not.
 * @function getStreamByUserName
 * @param {String} uid uid of the user
 * @param {String} streamerName streamerName of the person the user has chosen
 */
function getStreamByUserName(uid, streamerName) {
    firebaseFunctions.getDataFromFireBase(uid, "Twitch")
    .then(async clientToken => {
        let headers = {
            "Authorization": clientToken.authorization,
            "Client-Id": clientToken.clientId,
        };
        params = {
            user_login: streamerName,
        }
        OriginUrl = "https://api.twitch.tv/helix/streams"
        url = `${OriginUrl}?${encodeQueryString(params)}`
        const res = await fetch(url, { headers });
        const dataTwitch = await res.json();
        if (dataTwitch.data[0]) {
            console.log("true", streamerName, "is on live.")
            return true;
        } else {
            console.log("false", streamerName, "does not stream.")
            return false;
        }
    })
    .catch(error => {
        console.log(error);
    });
}

/**
 * See if the chosen streamer is live or not and have more than viewer number choose.
 * @function checkVierwers
 * @param {String} uid uid of the user
 * @param {String} streamerName__nbViewers streamer name than the user has chosen and Number of viewers required
 */
function checkVierwers(uid , streamerName__nbViewers) {
    const myArray = streamerName__nbViewers.split("__");
    const streamerName = myArray[0];
    const nbViewer = myArray[1];
    firebaseFunctions.getDataFromFireBase(uid, "Twitch")
    .then(async clientToken => {
        let headers = {
            "Authorization": clientToken.authorization,
            "Client-Id": clientToken.clientId,
        };
        params = {
            user_login: streamerName,
        }
        OriginUrl = "https://api.twitch.tv/helix/streams"
        url = `${OriginUrl}?${encodeQueryString(params)}`
        const res = await fetch(url, { headers });
        const dataTwitch = await res.json();
        if (dataTwitch.data[0]) {
            if (dataTwitch.data[0].viewer_count > nbViewer) {
                console.log("true", streamerName, "got ", dataTwitch.data[0].viewer_count, ".")
                return true;
            } else {
                console.log("false", streamerName, "does not have", nbViewer ,"viewer.")
                return false;
            }
        } else {
            console.log("false", streamerName, "does not stream.")
            return false;
        }
    })
    .catch(error => {
        console.log(error);
    });
}

module.exports = {
    /**
     * function tree which allows you to choose the right function
     * @param {string} func function chosen by the user
     * @param {string} uid uid of the user
     * @param {string} param It can be the name of a streamer, the name of a streamer & the number of viewers required or the name of a game.
     */
    actionTwitch: function(func, uid, param) {
        if (func == "viewers")
            checkVierwers(uid, param)
        else if (func == "stream")
            getStreamByUserName(userId, param)
        else if (func == "game")
            checkTopGames(uid, param)
    }
}   