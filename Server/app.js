const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const {port} = require('./config');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/about', (req, res) => {
    
    const about = JSON.stringify(
        {
            "client": {
                "host": req.ip
            },
            "server": {
                "current_time": Date.now(),
                "services": [{
                    "name": "Weather",
                    "actions": [{
                        "name": "get_forecast",
                        "description": "Get the rain forecast for the next 24 hours"
                    }],
                    "reactions": [{
                        "name": "like_message",
                        "description": "Like a message"
                    }]
                }]
            }
        }
    )
    res.send(about)
    
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})