const googleService = require('./googleService');
const http = require('http');
const configOpenMeteo = require ('./../configOpenMeteo')

module.exports = {
    WeatherRainingOrNot: function(res) {
        var request = http.get(`http://api.open-meteo.com/v1/forecast?latitude=${configOpenMeteo.latitude}&longitude=${configOpenMeteo.longitude}&hourly=rain`, function (response) {
            var buffer = ""
            var data;
{}
            response.on("data", function (chunk) {
                buffer += chunk;
            }); 
            response.on("end", function (err) {
                data = JSON.parse(buffer);
                // get date and time info
                var date = new Date().toISOString().slice(0, 10);
                var hour = new Date().getHours();
                console.log(date, 'à', hour, 'heures')
                // Search for data corresponding to the current date
                for (var i = 0; i < data.hourly.time.length; i++) {
                    // Compare date and time
                    if (data.hourly.time[i].slice(0, 10) == date && data.hourly.time[i].slice(11, 13) == hour) {
                        // Check if it is raining
                        if (data.hourly.rain[i + 1] > 0) {
                            console.log(`Il pleut le ${date} à ${hour} heures`)
                            googleService.send_mail(`Il pleut le ${date} à ${hour} heures`)
                        } else {
                            console.log(`Il pleut pas le ${date} à ${hour} heures`)
                            googleService.send_mail(`Il pleut pas le ${date} à ${hour} heures`)
                        }
                        break;
                    }
                }
            })
        })
        res.send('Weather info')
    }
}