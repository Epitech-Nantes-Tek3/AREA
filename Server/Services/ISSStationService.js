
/**
 * IssStationService module
 * @module IssStationService
 */

/**
 * @constant http
 * @requires http
 */
const http  = require('http');

/**
 * @constant firebaseFunctions
 * @requires firebaseFunctions
 */
const firebaseFunctions = require('../firebaseFunctions');

/**
 * url of the API
 * @constant url
 * @requires "http://api.open-notify.org/iss-now.json"
 */
const url = 'http://api.open-notify.org/iss-now.json';

/**
 * Earth Radius
 * @constant EarthRadius
 * @requires 6374
 */
const EarthRadius = 6374

module.exports = {
    /**
     * Check the ISS position, compute the distance between the user and the 
     * ISS and return true if iss is close
     * @function checkISSPosition
     * @param {*} uid needed to connect to the firebase to get user position
     * @returns {Promise}
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
    },
    /**
     * Register the user data in the db.
     * @function RegistedRequiredIss
     * @param {string} uid user id
     * @param {Object} data data is an object containing the latitude & longitude
     */
    RegistedRequiredIss: function(uid, data) {
        var informations = {
            gap: 1000,
            latitude: data.latitude,
            longitude: data.longitude
        }
        firebaseFunctions.setDataInDb(`USERS/${uid}/IssStation`, informations)
    }
}

/**
 * Convert a degree value in radiant
 * @function Radiant
 * @param1 degrees to be converted in radiant
 * @return {number} the converted value
 * 
*/
function Radiant(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}