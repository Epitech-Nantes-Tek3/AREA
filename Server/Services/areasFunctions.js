/**
 * AreasFunctions module
 * @module areasFunctions
 */

/**
 * @constant firebaseFunctions
 * @requires firebaseFunctions
 */
const firebaseFunctions = require('../firebaseFunctions');

/**
 * @constant openMeteoService
 * @requires openMeteoService
 */
const openMeteoService = require('./openMeteoService');

/**
 * @constant twitterService
 * @requires twitterService
 */
const twitterService = require('./twitterService');

/**
 * @constant TwitchService
 * @requires TwitchService
 */
const TwitchService = require('./TwitchService');

/**
 * @constant googleService
 * @requires googleService
 */
const googleService = require('./googleService');

/**
 * @constant IssStationService
 * @requires ISSStationService
 */
const ISSService = require('././ISSStationService');

/**
 * @constant spotifyServices
 * @requires spotifyServices
 */
const spotifyServices = require('././spotifyServices');

/**
  * @constant stravaService
  * @requires stravaService
  */
const stravaService = require('././stravaService');

/**
 * Contains all area.
 * @type {{name, function}}
 * @property {string} name Name
 * @property {function} function Function
*/
let areas = [
    { name: "météo", function:  openMeteoService.ActionWeather},
    { name: "twitter", function:  twitterService.ActionTw},
    { name: "google", function:  googleService.send_mail},
    { name: "iss", function:  ISSService.checkISSPosition },
    { name: "twitch", function:  TwitchService.actionTwitch},
    { name: "spotify", function:  spotifyServices.SpotifyLoop},
    { name: "strava", function:  stravaService.StravaLoop}
]

module.exports = {
    /**
    * areaLoop - This function is used to loop through the areas and perform corresponding actions and reactions
    * based on the data retrieved from Firebase for a specific user id.
    * @async
    * @function areaLoop
    * @param {string} uid - User Id
    */
    areaLoop: async function(uid) {
        try {
            const data = await firebaseFunctions.getDataFromFireBase(uid, 'AREAS');
            for (const area in data) {
                const ActionName = data[area].Action.serviceName;
                const Actiontrigger = data[area].Action.trigger;
                const ActionText = data[area].Action.text;
                const ActionFunc = data[area].Action.subject;
                const ReactionName = data[area].Reaction.serviceName;
                const ReactionSubject = data[area].Reaction.subject;
                const Reactiontext = data[area].Reaction.text;
                for (const action of areas) {
                    if (action.name == ActionName) {
                        const data = await action.function(uid, ActionFunc,ActionText);
                        if (data == Actiontrigger) {
                            for (const reaction of areas) {
                                if (reaction.name == ReactionName) {
                                    reaction.function(uid, ReactionSubject, Reactiontext);
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    /**
    * areaRegister - function that stores the provided area data in the firebase database under the specified user id
    * @function areaRegister
    * @param {string} uid - user id
    * @param {object} Action - action data to be stored
    * @param {object} Reaction - reaction data to be stored
    * @param {string} id - area id
    */
    areaRegister: function(uid, Action, Reaction, id) {
        firebaseFunctions.getDataFromFireBase(uid, '')
        .then(data => {
            var area = {
                Action,
                Reaction,
                id
            }
            firebaseFunctions.setDataInDb(`USERS/${uid}/AREAS/${id}`, area);
        })
        .catch(error => {
            console.log(error);
        });
    },
}