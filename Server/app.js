const express = require('express');
const app = express();
const {port} = require('./config');

const openMeteoService = require('./Services/openMeteoService');
const dbRealTime = require('./RealTimeDB');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/weather', (req, res) => {
    openMeteoService.WeatherRainingOrNot(res)
})

app.get('/firebase', (req, res) => {
    dbRealTime.getDataFromFireBase('57xAZfpYTrOThjmGaJO8DiNmCF32', 'GoogleService', 'user')
    res.send('firebase info')
})

app.listen(port, () => {
    console.log(`AREA app server listening on port ${port}!`)
})