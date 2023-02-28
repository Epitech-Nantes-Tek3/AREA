
const firebaseFunctions = require('../firebaseFunctions');

var stravaApi = require('strava-v3');

async function isBikeStatsOver(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
         firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            console.log(data);
            var stravaClient = new stravaApi.client(data.access_token);
            const stats = await stravaClient.athletes.stats({id: data.athleteId});

            if (stats.all_ride_totals.distance % 1000 == 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })

}

async function isRunStatsOver(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
         firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            console.log(data);
            var stravaClient = new stravaApi.client(data.access_token);
            const stats = await stravaClient.athletes.stats({id: data.athleteId});

            if (stats.all_run_totals.distance % 1000 == 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })

}

async function isSwimStatsOver(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
         firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            console.log(data);
            var stravaClient = new stravaApi.client(data.access_token);
            const stats = await stravaClient.athletes.stats({id: data.athleteId});

            if (stats.all_swim_totals.distance % 1000 == 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })

}

async function isNewComment(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
         firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            console.log(data);
            var stravaClient = new stravaApi.client(data.access_token);
            const activities = await stravaClient.athlete.listActivities({id: data.athleteId});
            
            console.log(activities[0].comment_count);
            if (data.lastActivity.id == 0 || activities[0].id != data.lastActivity.id) {
                firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/lastActivity/',{
                    id: activities[0].id,
                    kudos: activities[0].kudos_count,
                    comments: activities[0].comment_count
                })
            } else {
                if (data.lastActivity.comments < activities[0].comment_count) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })

}

async function isNewKudo(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
         firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            console.log(data);
            var stravaClient = new stravaApi.client(data.access_token);
            const activities = await stravaClient.athlete.listActivities({id: data.athleteId});
            
            console.log(activities[0].kudos_count);
            if (data.lastActivity.id == 0 || activities[0].id != data.lastActivity.id) {
                firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/lastActivity/',{
                    id: activities[0].id,
                    kudos: activities[0].kudos_count,
                    comments: activities[0].comment_count
                })
            } else {
                if (data.lastActivity.kudos < activities[0].kudos_count) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })

}

async function isNewActivity(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
         firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            console.log(data);
            var stravaClient = new stravaApi.client(data.access_token);
            const activities = await stravaClient.athlete.listActivities({id: data.athleteId});
            
            try {
                if (data.lastActivity.id != activities[0].id) {
                    firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/lastActivity/',{
                        id: activities[0].id,
                        kudos: activities[0].kudos_count,
                        comments: activities[0].comment_count
                    })
                    console.log('new activity');
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                console.log(error);
            }
        })
        .catch(error =>{
            console.error(error)
            reject(error)
        })
    })

}

module.exports = {
    StravaLoop : async function(uid, func, param) {
        return new Promise(async (resolve, reject) => {
            if (func == "bikeStats") {
                const result = await isBikeStatsOver(uid)
                console.log(result)
                resolve(result)
            } else if (func == "runStats") {
                const result = await isRunStatsOver(uid)
                console.log(result)
                resolve(result)
            } else if (func == "swinStats") {
                const result = await isSwimStatsOver(uid)
                console.log(result)
                resolve(result)
            } else if (func == "activity") {
                const result = await isNewActivity(uid)
                console.log('activity:', result);
                resolve(result)
            } else if (func == "kudo") {
                const result = await isNewKudo(uid, param)
                console.log(result)
                resolve(result)
            } else if (func == "comment") {
                const result = await isNewComment(uid)
                console.log(result)
                resolve(result)
            } else {
                reject(new Error(`Invalid function name: ${func}`));
            }
        })
    }
}