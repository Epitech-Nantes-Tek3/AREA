/**
 * OpenMeteoService module
 * @module OpenMeteoService
 */

/**
 * It allows to use http.
 * @constant http
 * @requires http
 */
const http = require('http');

/**
 * It allows to use firebaseFunctions.
 * @constant firebaseFunctions
 * @requires firebaseFunctions
 */
const firebaseFunctions = require('../firebaseFunctions');

/**
 * Check if it is weather is fine or not based on the current date and 
 * time and the weather code provided by the API.
 * @function WeatherisFineOrNot
 * @param latitude Latitude of the location to check the weather for.
 * @param longitude Longitude of the location to check the weather for.
 * @returns {Promise} A promise that resolves to a boolean indicating whether it is 
 * weather is fine or not.
 */
function WeatherisFineOrNot(latitude, longitude) {
    return new Promise((resolve, reject) => {
        http.get(`http://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weathercode`, function (response) {
            var buffer = ""
            var dataJson;
            response.on("data", function (chunk) {
                buffer += chunk;
            }); 
            response.on("end", function (err) {
                dataJson = JSON.parse(buffer);
                var date = new Date().toISOString().slice(0, 10);
                var hour = new Date().getHours();
                dataJson.hourly.time.forEach(function(time, i) {
                    if (time.slice(0, 10) == date && time.slice(11, 13) == hour) {
                        var weatherCode = dataJson.hourly.weathercode[i];
                        if (weatherCode > 0 || weatherCode < 4)
                            resolve(true);
                        else
                            resolve(false);
                    }
                });
            })
        })
    });
}

/**
 * GetLocation function retrieves the location data from Firebase for the specified user ID.
 * @function GetLocation
 * @param uid (string) user ID
 * @returns Promise that resolves with location data if successful or rejects with an error if unsuccessful
 */
function GetLocation(uid) {
    return new Promise((resolve, reject) => {
        firebaseFunctions.getDataFromFireBase(uid, 'OpenMeteoService')
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            console.log(error);
        });
    });
}

module.exports = {
    /**
    * ActionWeather is a Promise that is used to determine if the weather is fine or not.
    * @function ActionWeather
    * @param {string} uid - The unique identifier of a user.
    * @returns {Promise} A Promise that resolves with a boolean value indicating if the weather is fine or not.
    */
    ActionWeather: function(uid) {
        return new Promise((resolve, reject) => {
            GetLocation(uid)
            .then(data => {
                WeatherisFineOrNot(data.latitude, data.longitude)
                .then(weatherIsFine => {
                    if (weatherIsFine === true)
                        resolve(true);
                    else {
                        resolve(false);
                    }
                })
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
        });
    },
    /**
     * Register the user data in the db.
     * @function RegistedRequiredOpenMeteo
     * @param {string} uid user id
     * @param {Object} data data is an object containing the latitude & longitude
    */
    RegistedRequiredOpenMeteo: function(res, uid, data) {
        firebaseFunctions.setDataInDb(`USERS/${uid}/OpenMeteoService/`, data)
    }
}