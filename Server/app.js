const express = require('express');
const app = express();
const http = require('http');

const fs = require('fs');

const {port} = require('./config');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/about.json', (req, res) => {

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