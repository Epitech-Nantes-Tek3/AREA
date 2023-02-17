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

const { ApiClient } = require('twitch');
const https = require('https');


const scopes = [
    "analytics:read:extensions",
    "analytics:read:games",
    "moderator:read:followers",
    "channel:manage:moderators",
    "channel:manage:predictions",
    "user:manage:whispers"
].join(" ");

const response_type = "token"

const twitch_oauth_url = "https://id.twitch.tv/oauth2/authorize"

function encodeQueryString(params) {
    const queryString = new URLSearchParams();
    for (let paramName in params) {
        queryString.append(paramName, params[paramName]);
    }
    return queryString.toString();
}

function encodeUrlScope(params) 
{
    let items = []
    for (let key in params) {
        let value = encodeURIComponent(params[key])
        items.push(`${key}=${value}`)
    }
    return items.join("&")
}

async function checkTopGames(games, clientId, authorization) {
    let headers = {
        "Authorization": authorization,
        "Client-Id": clientId,
    };
    OriginUrl = "https://api.twitch.tv/helix/games/top"
    const res = await fetch(OriginUrl, { headers });
    const dataTwitch = await res.json();
    if (dataTwitch.data[0].name == games) {
        console.log("true top games is", game);
        return true;
    } else {
        console.log("false top game is", dataTwitch.data[0].name);
        return false;
    }
}

async function getStreamByUserName(username, clientId, authorization) {
    let headers = {
        "Authorization": authorization,
        "Client-Id": clientId,
    };
    params = {
        user_login: username,
    }
    OriginUrl = "https://api.twitch.tv/helix/streams"
    url = `${OriginUrl}?${encodeQueryString(params)}`
    const res = await fetch(url, { headers });
    const dataTwitch = await res.json();
    if (dataTwitch.data[0]) {
        console.log("true", username, "is on live.")
        return true;
    } else {
        console.log("false", username, "does not stream.")
        return true;
    }
}

async function checkMorethan1kViewers(username, clientId, authorization) {
    let headers = {
        "Authorization": authorization,
        "Client-Id": clientId,
    };
    params = {
        user_login: username,
    }
    OriginUrl = "https://api.twitch.tv/helix/streams"
    url = `${OriginUrl}?${encodeQueryString(params)}`
    const res = await fetch(url, { headers });
    const dataTwitch = await res.json();
    if (dataTwitch.data[0]) {
        if (dataTwitch.data[0].viewer_count > 1000) {
            console.log("true", username, "got ", dataTwitch.data[0].viewer_count, ".")
            return true;
        } else {
            console.log("false", username, "does not have 1000 viewer.")
            return true;
        }
    } else {
        console.log("false", username, "does not stream.")
        return true;
    }
}

async function sendWhisper(userFrom, userTo, message, authorization) {
    let headers = {
        "Authorization": authorization,
        "Client-Id": userFrom,
        "Content-Type" : "application/json"
    };
    let params = {
        from_id: userFrom,
        to_id: userTo,
        message: message
    };
    let OriginUrl = "https://api.twitch.tv/helix/whispers"
    let url = `${OriginUrl}?${encodeQueryString(params)}`
    let requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({text: message}),
    };
    try {
        let response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Error sending whisper: ${response.status} ${response.statusText}`);
        }
        console.log(`Whisper sent to ${userTo}: ${message}`);
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    getTwitchAuthorization: function(req, res) {
        return firebaseFunctions.getDataFromFireBaseServer("Twitch")
        .then(token => {
            const params = {
                client_id: token.clientId,
                redirect_uri: token.redirect_url,
                scope : scopes,
                response_type: response_type
            }
            const url = `${twitch_oauth_url}?${encodeUrlScope(params)}`
            res.redirect(url);
        })
        .catch(error => {
            console.error(error)
        })
    },
    doAct: function(authorization, action ,userId) {
        return firebaseFunctions.getDataFromFireBaseServer("Twitch")
        .then(token => {
            if (action == "message")
                sendWhisper(token.clientId, 566732693, "Hello Twitch !", authorization)
            else if (action == "morethan1k")
                checkMorethan1kViewers(userId, token.clientId, authorization)
            else if (action == "stream")
                getStreamByUserName(userId, token.clientId, authorization)
            else if (action == "topGames")
                checkTopGames(userId, token.clientId, authorization)
        })
    }
}