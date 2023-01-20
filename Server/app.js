const express = require('express');
const app = express();
const {port} = require('./config');

const openMeteoService = require('./Services/openMeteoService');
const dbRealTime = require('./RealTimeDB');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/weather', (req, res) => {
    openMeteoService.WeatherRainingOrNot(res, '57xAZfpYTrOThjmGaJO8DiNmCF32')
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})