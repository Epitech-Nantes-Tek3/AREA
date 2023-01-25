const http  = require('http');
const url = 'http://api.open-notify.org/iss-now.json';

module.exports = {
    checkISSPosition: function(res) {
        http.get(url, function (response) {
            response.on("data", function (chunk) {
                console.log("J'AI DATA")
            });
            response.on('error', function (err) {
                console.log('Problème 1')
            });

        })
        res.send('ISS Info')
    }
}