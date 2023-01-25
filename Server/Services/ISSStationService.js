const http  = require('http');
const url = 'http://api.open-notify.org/iss-now.json';

module.exports = {
    checkISSPosition: function(res) {
        http.get(url, function (response) {
            var buffer = ""
            
            response.on("data", function (chunk) {
                buffer += chunk
            });

            response.on("end", function (err) {
                var data = JSON.parse(buffer)
                var longitude = data.iss_position.longitude
                var latitude = data.iss_position.latitude
            });

            response.on('error', function (err) {
                console.log('Error while getting ISS Data')
            });

        })
        res.send('ISS Info')
    }
}