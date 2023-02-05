const firebaseFunctions = require('../firebaseFunctions')

module.exports = {
    area: function(req, res, uid) {
        firebaseFunctions.getDataFromFireBase(uid, 'AREAS')
        .then(data => {
            for (const area in data) {
                console.log(`\nNom de l'area: ${area}`);
                console.log(`Action de l'area:`, data[area].Action.name);
                console.log(`Trigger de l'area:`, data[area].Action.trigger);
                console.log(`Reaction de l'area:`, data[area].Reaction.name);
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
    * @param {object} aera - area data to be stored
    */
    areaRegister: function(uid, aera) {
        firebaseFunctions.setDataInDb(`USERS/${uid}/AREAS`, aera);
    }
}