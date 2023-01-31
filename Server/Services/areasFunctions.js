const firebaseFunctions = require('../firebaseFunctions')

module.exports = {
    area: function(req, res, uid) {
        console.log(uid);
        firebaseFunctions.getDataFromFireBase(uid, 'AREAS')
        .then(data => {
            res.send('read Working')
            console.log(data)
        })
        .catch(error => {
            res.send('error')
            console.log(error);
        });
    }
}