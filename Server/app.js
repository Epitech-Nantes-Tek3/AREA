const express = require('express');
const app = express();
const http = require('http');

const path = require('path');
const fs = require('fs');
const {TwitterApi} = require('twitter-api-v2')

const {port} = require('./config');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/weather', (req, res) => {
    var request = http.get('http://api.open-meteo.com/v1/forecast?latitude=47.22&longitude=-1.55&hourly=rain', function (response) {
        var buffer = ""
        var data;

        response.on("data", function (chunk) {
            buffer += chunk;
        }); 
    

        response.on("end", function (err) {
            data = JSON.parse(buffer);
            var date = new Date().toISOString().slice(0, 10);
            var hour = new Date().toISOString().slice(11, 16);
            console.log(hour)
            for (var i = 0; i < data.hourly.time.length; i++) {
                if (data.hourly.time[i].slice(0, 10) == date && data.hourly.time[i].slice(11, 16) == hour) {
                    if (data.hourly.rain[i + 1] > 0) {
                        console.log("Il pleut")
                    }
                    break;
                }
            }
        })
    })
    res.send('Weather')
})

app.get('/about', (req, res) => {

    var obj = new Array();
    const dir_path = 'Services'
    
    var services_file = fs.readdirSync(dir_path, function(err, items) {
        if (err) {
            console.log(err);
            return;
        }
    })

    for (var i = 0; i < services_file.length; i++) {
        if (services_file[i] == "template.json") {
            continue;
        }
        const data = fs.readFileSync(dir_path + '/' + services_file[i], 'utf8', function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
        })
        obj[i] = JSON.parse(data);
    }

    const about = JSON.stringify(
        {
            "client": {
                "host": req.ip
            },
            "server": {
                "current_time": Date.now(),
                "services": obj
            }
        }
    )
    res.send(about)
    
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})