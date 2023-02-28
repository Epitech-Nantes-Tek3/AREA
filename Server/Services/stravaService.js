
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

async function isNewClubActivity(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
         firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            console.log(data);
            var stravaClient = new stravaApi.client(data.access_token);
            const clubs = await stravaClient.athlete.listClubs({id: data.athleteId});
            
            for (let i = 0; i < clubs.length; i++) {
                const club = clubs[i];
                const activities = await stravaClient.clubs.listActivities({id: club.id, per_page: 100});
                console.log(activities.length);
                console.log(activities[0]);
            }

            resolve(true);
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
            if (func == "clubActivity") {                
                const result = await isNewClubActivity(uid); // check how to retrieve time
                console.log(result)
                resolve(result)
            } else if (func == "bikeStats") {
                const result = await isBikeStatsOver(uid) //done
                console.log(result)
                resolve(result)
            } else if (func == "runStats") {
                const result = await isRunStatsOver(uid) //done
                console.log(result)
                resolve(result)
            } else if (func == "swinStats") {
                const result = await isSwimStatsOver(uid) //done
                console.log(result)
                resolve(result)
            } else if (func == "activty") {
                const result = await isNewActivity(uid, param)
                console.log(result)
                resolve(result)
            } else if (func == "kudo") {
                const result = await isNewKudo(uid, param) //done
                console.log(result)
                resolve(result)
            } else if (func == "comment") {
                const result = await isNewComment(uid) //done
                console.log(result)
                resolve(result)
            } else {
                reject(new Error(`Invalid function name: ${func}`));
            }
        })
    }
}