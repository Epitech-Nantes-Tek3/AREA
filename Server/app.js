const express = require('express');
const app = express();
const {port} = require('./config');

const openMeteoService = require('./Services/openMeteoService');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/weather', (req, res) => {
    openMeteoService.WeatherRainingOrNot(res)
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})