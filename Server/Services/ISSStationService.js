const { cp } = require('fs');
const http  = require('http');
const firebaseFunctions = require('../firebaseFunctions');
const url = 'http://api.open-notify.org/iss-now.json';
const gap = 1000.0
const heartRadius = 6374

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
                    var longitudeISS = dataISS.iss_position.longitude //B2
                    var latitudeISS = dataISS.iss_position.latitude //C2
                    var longitudeUser = data.longitude //B3
                    var latitudeUser = data.latitude //

                    console.log(longitudeISS, latitudeISS, longitudeUser, latitudeUser)

                    /// https://www.01net.com/actualites/calculer-la-distance-entre-2-points-sur-terre-522697.html#:~:text=La%20formule%20(%C3%A0%20saisir%20par,C3)))*6371.
                    var distance = Math.acos(Math.sin(Radiant(longitudeISS)) * Math.sin(Radiant(longitudeUser)) +
                        Math.cos(Radiant(longitudeISS)) * Math.cos(Radiant(longitudeUser)) * Math.cos(Radiant(latitudeISS - latitudeUser))) * heartRadius

                    console.log(distance)

                    if (distance <= gap)
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

/// Convert a degree value in radiant
// - degrees : value to be converted
function Radiant(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}