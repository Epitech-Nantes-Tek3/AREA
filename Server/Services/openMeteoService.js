const googleService = require('./googleService');
const http = require('http');

module.exports = {
    WeatherRainingOrNot: function(res) {
        var request = http.get('http://api.open-meteo.com/v1/forecast?latitude=47.22&longitude=-1.55&hourly=rain', function (response) {
            var buffer = ""
            var data;

            response.on("data", function (chunk) {
                buffer += chunk;
            }); 
            response.on("end", function (err) {
                data = JSON.parse(buffer);
                var date = new Date().toISOString().slice(0, 10);
                var hour = new Date().getHours();
                console.log(date, 'à', hour, 'heures')
                for (var i = 0; i < data.hourly.time.length; i++) {
                    if (data.hourly.time[i].slice(0, 10) == date && data.hourly.time[i].slice(11, 13) == hour) {
                        if (data.hourly.rain[i + 1] > 0) {
                            console.log(`Il pleut le ${date} à ${hour} heures`)
                            googleService.send_mail(`Il pleut le ${date} à ${hour} heures`)
                        }
                        console.log(`Il pleut pas le ${date} à ${hour} heures`)
                        googleService.send_mail(`Il pleut pas le ${date} à ${hour} heures`)
                        break;
                    }
                }
            })
        })
        res.send('Weather info')
    }
}