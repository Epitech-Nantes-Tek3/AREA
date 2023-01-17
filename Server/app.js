const express = require('express');
const app = express();
const http = require('http');

const path = require('path');
const fs = require('fs');

var Twitter = require('twitter')
var config = require('./twitter_config.js')
var T = new Twitter(config)

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
                        console.log("Il pleut pas")
                        var params = {
                            q: '#nodejs',
                            count: 10,
                            result_type: 'recent',
                            lang: 'en'
                        }

                        T.get('search/tweets', params, function(err, data, response) {
                            if (!err) {
                                console.log('test')
                                for(let i = 0; i < data.statuses.length; i++){
                                    // Get the tweet Id from the returned data
                                    let id = { id: data.statuses[i].id_str }
                                    // Try to Favorite the selected Tweet
                                    T.post('favorites/create', id, function(err, response){
                                      // If the favorite fails, log the error message
                                      if(err){
                                        console.log(err[0].message);
                                      }
                                      // If the favorite is successful, log the url of the tweet
                                      else{
                                        let username = response.user.screen_name;
                                        let tweetId = response.id_str;
                                        console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
                                      }
                                    });
                                  }
                            } else {
                                console.log(err)
                            }
                        })
                          
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