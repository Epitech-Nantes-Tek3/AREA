const firebaseFunctions = require('../firebaseFunctions')
const openMeteoService = require('./openMeteoService');
const twitterService = require('./twitterService');
const googleService = require('./googleService');
const ISSService = require('././ISSStationService');

let areas = [
    { name: "openMeteo", function:  openMeteoService.ActionWeather},
    { name: "Twitter", function:  twitterService.ActionTw},
    { name: "Gmail", function:  googleService.send_mail},
    { name: "Iss", function:  ISSService.checkISSPosition },
]

module.exports = {
    /**
    * areaLoop - This function is used to loop through the areas and perform corresponding actions and reactions
    * based on the data retrieved from Firebase for a specific user id.
    *
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    * @param {string} uid - User Id
    */
    areaLoop: function(req, res, uid) {
        firebaseFunctions.getDataFromFireBase(uid, 'AREAS')
        .then(data => {
            for (const area in data) {
                const ActionName = data[area].Action.name;
                const Actiontrigger = data[area].Action.trigger;
                const ReactionName = data[area].Reaction.name;
                const ReactionSubject = data[area].Reaction.subject;
                const Reactiontext = data[area].Reaction.text;
                areas.forEach((action) => {
                    if (action.name == ActionName) {
                        action.function(uid)
                        .then(data => {
                            if (data == Actiontrigger) {
                                areas.forEach((reaction) => {
                                    if (reaction.name == ReactionName) {
                                        reaction.function(ReactionSubject, Reactiontext, uid, req, res)
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
            res.redirect('/')
        })
        .catch(error => {
            res.send('error')
            console.log(error);
        });
    },
    /**
    * areaRegister - function that stores the provided area data in the firebase database under the specified user id
    * @param {string} uid - user id
    * @param {object} Action - action data to be stored
    * @param {object} Reaction - reaction data to be stored
    */
    areaRegister: function(uid, Action, Reaction) {
        firebaseFunctions.getDataFromFireBase(uid, '')
        .then(data => {
            console.log(data.areaNumber)
            areaname = `AREA${data.areaNumber + 1}`
            console.log(areaname)
            var area = {
                Action,
                Reaction,
            }
            console.log(area)
            var areaNumber = data.areaNumber + 1
            firebaseFunctions.setDataInDb(`USERS/${uid}/AREAS/${areaname}`, area);
            firebaseFunctions.setDataInDb(`USERS/${uid}/areaNumber`, areaNumber);
        })
        .catch(error => {
            console.log(error);
        });
    }
}