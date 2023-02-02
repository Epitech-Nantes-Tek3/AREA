const firebaseFunctions = require('../firebaseFunctions')
const openMeteoService = require('./openMeteoService');
const twitterService = require('./twitterService');
const googleService = require('./googleService');

let areas = [
    { name: "openMeteo", function:  openMeteoService.ActionWeather},
    { name: "Twitter", function:  twitterService.twitterActions},
    { name: "Gmail", function:  googleService.send_mail},
]

module.exports = {
    area: function(req, res, uid) {
        firebaseFunctions.getDataFromFireBase(uid, 'AREAS')
        .then(data => {
            for (const area in data) {
                // console.log(`\nNom de l'area: ${area}`);
                // console.log(`Action de l'area:`, data[area].Action.name);
                // console.log(`Trigger de l'area:`, data[area].Action.trigger);
                // console.log(`Reaction de l'area:`, data[area].Reaction.name);
                // console.log(`Subject de l'area:`, data[area].Reaction.subject);
                // console.log(`text de l'area:`, data[area].Reaction.text);
                const ActionName = data[area].Action.name;
                const Actiontrigger = data[area].Action.trigger;
                const ReactionName = data[area].Reaction.name;
                const ReactionSubject = data[area].Reaction.subject;
                const Reactiontext = data[area].Reaction.text;
                areas.forEach((action) => {
                    // console.log('COMPARAISON ACTION NAME:', ActionName)
                    if (action.name == ActionName) {
                        action.function(uid)
                        .then(data => {
                            const bool = (Actiontrigger === "true") ? true : false;
                            if (data === bool) {
                                areas.forEach((reaction) => {
                                    // console.log('COMPARAISON ReactionName:', ReactionName)
                                    // console.log('COMPARAISON ReactionSubject:', ReactionSubject)
                                    // console.log('COMPARAISON Reactiontext:', Reactiontext)
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