
const firebaseFunctions = require('../firebaseFunctions');

var stravaApi = require('strava-v3');

async function isStatsOver(uid) {
    return new Promise ((resolve, reject) => {
        console.log(uid);
         firebaseFunctions.getDataFromFireBase(uid, "StravaService")
        .then(async data => {
            console.log(data);
            var stravaClient = new stravaApi.client(data.access_token);
            const stats = await stravaClient.athletes.stats({id: data.athleteId});
            
            //console.log(stats);

            console.log(stats.all_ride_totals.distance);
            console.log(stats.all_swim_totals.distance);
            console.log(stats.all_run_totals.distance);

            resolve(true);
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
                const result = await isNewClubActivity(uid);
                console.log(result)
                resolve(result)
            } else if (func == "stats") {
                const result = await isStatsOver(uid)
                console.log(result)
                resolve(result)
            } else if (func == "activty") {
                const result = await isNewActivity(uid, param)
                console.log(result)
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