const { cp } = require('fs');
const http  = require('http');
const firebaseFunctions = require('../firebaseFunctions');
const url = 'http://api.open-notify.org/iss-now.json';
const EarthRadius = 6374

module.exports = {
    /**
     * @brief Check the ISS position, compute the distance between the user and the 
     * ISS and return true if iss is close
     *
     * @param {*} res the request
     * @param {*} uid needed to connect to the firebase to get user position
     * @param {*} gap gap between position and Iss
     */
    checkISSPosition: function(uid) {
        return firebaseFunctions.getDataFromFireBase(uid, 'IssStation')
        .then(data => {
            return new Promise((resolve, reject) => {
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
    
                        console.log(longitudeISS, latitudeISS, longitudeUser, latitudeUser)
    
                        var distance = Math.acos(Math.sin(Radiant(longitudeISS)) * Math.sin(Radiant(longitudeUser)) +
                            Math.cos(Radiant(longitudeISS)) * Math.cos(Radiant(longitudeUser)) * Math.cos(Radiant(latitudeISS - latitudeUser))) * EarthRadius
    
                        if (distance <= data.gap) {
                            console.log("inf")
                            resolve(true);
                        } else {
                            console.log("sup")
                            resolve(false);
                        }
                    });
    
                    response.on('error', function (err) {
                        reject('Error while getting ISS Data');
                    });
                })
            });
        })
        .catch(error => {
            console.log(error);
        });
    }
}

/**
 * @brief Convert a degree value in radiant
 *
 * @param1 degrees to be converted in radiant
 *
 * @return the converted value
 * */
function Radiant(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}