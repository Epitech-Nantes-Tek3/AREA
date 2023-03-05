/**
 * stravaService module
 * @module stravaService
 */

/**
 * It allows to use firebaseFunctions.
 * @constant firebaseFunctions
 * @requires firebaseFunctions
 */
const firebaseFunctions = require('../firebaseFunctions');

/**
 * It allows to use stravaApi.
 * @constant stravaApi
 * @requires strava-v3
 */
var stravaApi = require('strava-v3');

/**
 * Asks the api if the user has more than 1000 km on the bike.
 * @async
 * @function isBikeStatsOver
 * @param {string} uid user ID
*/
async function isBikeStatsOver(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
        try {
            firebaseFunctions.getDataFromFireBase(uid, "StravaService")
            .then(async data => {
                var stravaClient = new stravaApi.client(data.access_token);
                const stats = await stravaClient.athletes.stats({id: data.athleteId});

                if (stats.all_ride_totals.distance != data.stats.bike.stat && (stats.all_ride_totals.distance - data.stats.bike.stat) >= 100000 && data.stats.bike.triggered == true) {
                    firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/stats/bike',{
                        stat: data.stats.bike.stat,
                        triggered: false
                    })
                }
                if ((stats.all_ride_totals.distance - data.stats.bike.stat) % 100000 < 100000 && data.stats.bike.triggered == false) {
                    firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/stats/bike',{
                        stat: stats.all_ride_totals.distance - (stats.all_ride_totals.distance % 100000),
                        triggered: true
                    })
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error =>{
                console.error(error)
                reject(error)
            })
        } catch (error) {
            console.error(error);
        }
    })

}

/**
 * Asks the api if the user has run more than 1000 km.
 * @async
 * @function isRunStatsOver
 * @param {string} uid user ID
*/
async function isRunStatsOver(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
        firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            var stravaClient = new stravaApi.client(data.access_token);
            const stats = await stravaClient.athletes.stats({id: data.athleteId});

            if (stats.all_run_totals.distance != data.stats.run.stat && (stats.all_run_totals.distance - data.stats.run.stat) >= 100000 && data.stats.run.triggered == true) {
                firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/stats/run',{
                    stat: data.stats.run.stat,
                    triggered: false
                })
            }
            if ((stats.all_run_totals.distance - data.stats.run.stat) % 100000 < 100000 && data.stats.run.triggered == false) {
                firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/stats/run',{
                    stat: stats.all_run_totals.distance - (stats.all_run_totals.distance % 100000),
                    triggered: true
                })
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

/**
 * Asks the api if the user has swum more than 1000 km.
 * @async
 * @function isSwimStatsOver
 * @param {string} uid user ID
*/
async function isSwimStatsOver(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
        firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            var stravaClient = new stravaApi.client(data.access_token);
            const stats = await stravaClient.athletes.stats({id: data.athleteId});

            if (stats.all_swim_totals.distance != data.stats.swim.stat && (stats.all_swim_totals.distance - data.stats.swim.stat) >= 100000 && data.stats.swim.triggered == true) {
                firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/stats/swim',{
                    stat: data.stats.swim.stat,
                    triggered: false
                })
            }
            if ((stats.all_swim_totals.distance - data.stats.swim.stat) % 100000 < 100000 && data.stats.swim.triggered == false) {
                firebaseFunctions.setDataInDb('USERS/' + uid + '/StravaService/stats/swim',{
                    stat: stats.all_swim_totals.distance - (stats.all_swim_totals.distance % 100000),
                    triggered: true
                })
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

/**
 * Asks the api if the user has a new comment on their last activity.
 * @async
 * @function isNewComment
 * @param {string} uid user ID
*/
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

/**
 * Asks the api if the user has a new like on their last activity.
 * @async
 * @function isNewKudo
 * @param {string} uid user ID
*/
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

/**
 * Asks the api if the user has a new activity.
 * @async
 * @function isNewActivity
 * @param {string} uid user ID
*/
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
    /**
     * function tree which allows you to choose the right function
     * @async
     * @function StravaLoop
     * @param {string} func function chosen by the user
     * @param {string} uid uid of the user
     * @param {string} param empty
     * @returns returns a bool true condition is true otherwise returns false
     */
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
                const result = await isNewKudo(uid)
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