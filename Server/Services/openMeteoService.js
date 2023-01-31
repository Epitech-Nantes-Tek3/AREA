const googleService = require('./googleService');
const http = require('http');

const firebaseFunctions = require('../firebaseFunctions');

let comparaisons = [
    { name: "Ciel clair", result: 0},
    { name: "Principalement clair", result: 1},
    { name: "Partiellement nuageux", result: 2},
    { name: "Partiellement couvert", result: 3},
    { name: "Brouillard", result: 45},
    { name: "Brouillard givrant", result: 48},
    { name: "Brume légère", result: 51},
    { name: "Brume modérée", result: 53},
    { name: "Brume dense", result: 55},
    { name: "Légère brume verglaçante", result: 56},
    { name: "Dense brume verglaçante", result: 57},
    { name: "Pluie légère", result: 61},
    { name: "Pluie modérée", result: 63},
    { name: "Pluie forte", result: 65},
    { name: "Pluie verglaçante légère", result: 66},
    { name: "Pluie verglaçante forte", result: 67},
    { name: "Chute de neige légère", result: 71},
    { name: "Chute de neige modérées", result: 73},
    { name: "Chute de neige forte", result: 75},
    { name: "Petit flocon de neige", result: 77},
    { name: "Averses de pluie légères", result: 80},
    { name: "Averses de pluie modérée", result: 81},
    { name: "Averses de pluie violentes", result: 82},
    { name: "Averses de neige légères", result: 85},
    { name: "Averses de neige fortes", result: 86},
    //Thunderstorm forecast with hail is only available in Central Europe
    { name: "Orage", result: 95},
    { name: "Orage avec grêle légère", result: 96},
    { name: "Orage avec grêle forte", result: 99}
]

module.exports = {
    WeatherRainingOrNot: function(res, uid) {
        res.send('Weather info')
        firebaseFunctions.getDataFromFireBase(uid, 'OpenMeteoService')
        .then(data => {
            var request = http.get(`http://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&hourly=weathercode`, function (response) {
                var buffer = ""
                var data;
                response.on("data", function (chunk) {
                    buffer += chunk;
                }); 
                response.on("end", function (err) {
                    data = JSON.parse(buffer);
                    // get date and time info
                    var date = new Date().toISOString().slice(0, 10);
                    var hour = new Date().getHours();
                    // Search for data corresponding to the current date
                    data.hourly.time.forEach(function(time, i) {
                        // Compare date and time
                        if (time.slice(0, 10) == date && time.slice(11, 13) == hour) {
                            // obtaining the weather code to get the time
                            var weatherCode = data.hourly.weathercode[i];
                            comparaisons.forEach((comparaison) => {
                                // comparison of the weathercode to all our weathercodes
                                if (comparaison.result == weatherCode) {
                                    if (weatherCode < O || weatherCode > 3)
                                        return false;
                                    else
                                        return true;
                                }
                            });
                        }
                    });
                })
            })
        })
        .catch(error => {
        console.log(error);
        });
    }
}