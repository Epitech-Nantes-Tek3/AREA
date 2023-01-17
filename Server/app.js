const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const {port} = require('./config');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/about', (req, res) => {
    
    var ojb = [{
        name: '',
        actions: [],
        reactions: []
    }]

    ojb[0].name = "Weather"
    ojb[0].actions.push({name: "get_forecast", description: "Get the rain forecast for the next 24 hours"})
    ojb[0].reactions.push({name: "like_message", description: "Like a message"})

    const about = JSON.stringify(
        {
            "client": {
                "host": req.ip
            },
            "server": {
                "current_time": Date.now(),
                "services": ojb
            }
        }
    )
    res.send(about)
    
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})