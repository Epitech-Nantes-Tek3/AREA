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
]

module.exports = {
    /**
    * areaLoop - This function is used to loop through the areas and perform corresponding actions and reactions
    * based on the data retrieved from Firebase for a specific user id.
    * @function areaLoop
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    * @param {string} uid - User Id
    */
    areaLoop: function(uid) {
        firebaseFunctions.getDataFromFireBase(uid, 'AREAS')
        .then(data => {
            for (const area in data) {
                const ActionName = data[area].Action.serviceName;
                const Actiontrigger = data[area].Action.trigger;
                const ReactionName = data[area].Reaction.serviceName;
                const ReactionSubject = data[area].Reaction.subject;
                const Reactiontext = data[area].Reaction.text;
                areas.forEach((action) => {
                    if (action.name == ActionName) {
                        action.function(uid)
                        .then(data => {
                            if (data == Actiontrigger) {
                                areas.forEach((reaction) => {
                                    if (reaction.name == ReactionName) {
                                        reaction.function(ReactionSubject, Reactiontext, uid)
                                    }
                                })
                            } 
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
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