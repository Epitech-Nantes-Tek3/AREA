const http  = require('http');
const firebaseFunctions = require('../firebaseFunctions');
const url = 'http://api.open-notify.org/iss-now.json';
const gap = 100

module.exports = {
    checkISSPosition: function(res, uid) {
        firebaseFunctions.getDataFromFireBase(uid, 'OpenMeteoService')
        .then(data => {
            var InfoISS = ""
            http.get(url, function (response) {
                var buffer = ""

                response.on("data", function (chunk) {
                    buffer += chunk
                });

                response.on("end", function (err) {
                    var dataISS = JSON.parse(buffer)
                    var longitudeISS = dataISS.iss_position.longitude
                    var latitudeISS = dataISS.iss_position.latitude
                    var longitudeUser = data.longitude
                    var latitudeUser = data.latitude

                    if (true)
                        InfoISS = "THE ISS IS NEAR US BEWARE"
                    else
                        InfoISS =  "THE ISS IS FAR IT'S FINE"
                    res.send(InfoISS)
                });

                response.on('error', function (err) {
                    console.log('Error while getting ISS Data')
                });
            })

        })
        .catch(error => {
            console.log(error);
        });
    }
}