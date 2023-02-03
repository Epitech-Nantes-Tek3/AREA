const firebaseFunctions = require('../firebaseFunctions')
const openMeteoService = require('./openMeteoService');
const twitterService = require('./twitterService');
const googleService = require('./googleService');

let areas = [
    { name: "openMeteo", function:  openMeteoService.ActionWeather},
    { name: "Twitter", function:  twitterService.ActionTw},
    { name: "Gmail", function:  googleService.send_mail},
]

module.exports = {
    area: function(req, res, uid) {
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
                            const bool = (Actiontrigger === "true") ? true : false;
                            if (data === bool) {
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
    }
}