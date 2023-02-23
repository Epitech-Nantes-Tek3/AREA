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
 * @async
 * @param {String} uid uid of the user
 * @param {String} game Game selected by the user
 * @param {String} clientID clientID token of the twitch developer account
 * @returns returns a bool true condition is true otherwise returns false
 */
async function checkTopGames(uid, game, clientID) {
    try {
        const clientToken = await firebaseFunctions.getDataFromFireBase(uid, "TwitchService");
        let headers = {
            "Authorization": clientToken.authorization,
            "Client-Id": clientID,
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
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * See if the chosen streamer is live or not.
 * @async
 * @function getStreamByUserName
 * @param {String} uid uid of the user
 * @param {String} streamerName streamerName of the person the user has chosen
 * @param {String} clientID clientID token of the twitch developer account
 * @returns returns a bool true condition is true otherwise returns false
 */
async function getStreamByUserName(uid, streamerName, clientID) {
    try {
        const clientToken = await firebaseFunctions.getDataFromFireBase(uid, "TwitchService")
        let headers = {
            "Authorization": clientToken.authorization,
            "Client-Id": clientID,
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
    }
    catch(error) {
        console.log(error);
    };
}

/**
 * See if the chosen streamer is live or not and have more than viewer number choose.
 * @async
 * @function checkViewers
 * @param {String} uid uid of the user
 * @param {String} streamerName__nbViewers streamer name than the user has chosen and Number of viewers required
 * @param {String} clientID clientID token of the twitch developer account
 * @returns returns a bool true condition is true otherwise returns false
 */
async function checkViewers(uid , streamerName__nbViewers, clientID) {
    try {
        const myArray = streamerName__nbViewers.split("__");
        const streamerName = myArray[0];
        const nbViewer = myArray[1];
        const clientToken = await firebaseFunctions.getDataFromFireBase(uid, "TwitchService")
        let headers = {
            "Authorization": clientToken.authorization,
            "Client-Id": clientID,
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
    } catch (error) {
        console.log(error);
    };
}

module.exports = {
    /**
     * function tree which allows you to choose the right function
     * @async
     * @function actionTwitch
     * @param {string} func function chosen by the user
     * @param {string} uid uid of the user
     * @param {string} param It can be the name of a streamer, the name of a streamer & the number of viewers required or the name of a game.
     * @returns returns a bool true condition is true otherwise returns false
     */
    actionTwitch: async function(uid, func, param) {
        return new Promise((resolve, reject) => {
            firebaseFunctions.getDataFromFireBaseServer('Twitch')
                .then(async token => {
                    if (func == "game") {
                        const result = await checkTopGames(uid, param, token.clientId);
                        console.log(result)
                        resolve(result);
                    } else if (func == "viewers") {
                        const result = await checkViewers(uid, param, token.clientId);
                        console.log(result)
                        resolve(result);
                    } else if (func == "stream") {
                        const result = await getStreamByUserName(uid, param, token.clientId);
                        console.log(result)
                        resolve(result);
                    } else {
                        reject(new Error(`Invalid function name: ${func}`));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    /**
     * Sets the user data in the Firebase database.
     * @function setUserData
     * @param {Object} twhtokens - An object containing the Twitch API access and refresh tokens, as well as the user ID.
     */
    setUserData: function(twhtokens) {
        token_type = "bearer"
        token_type = token_type.substring(0, 1).toUpperCase() + token_type.substring(1, token_type.length);
        let authorization = `${token_type} ${twhtokens.accessToken}`;
        let tokens = {
            accessToken : twhtokens.accessToken,
            refreshToken : twhtokens.refreshToken,
            authorization : authorization
        }
        firebaseFunctions.setDataInDb(`USERS/${twhtokens.uid}/TwitchService`, tokens)
    }
}   