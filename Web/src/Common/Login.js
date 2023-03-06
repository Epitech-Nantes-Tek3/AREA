/**
 * @module Login
 */
import { getDataFromCache } from './CacheManagement'

/**
 * It checks if the user has a cache, if so, it returns the page, if not, it
 * returns the auth page
 * @param page - The page you want to go to.
 * @param props - The props of the page you're on.
 * @returns The page that the user is on.
 */
export function authWithCache(setUserInformation, props) {
    var cacheData = getDataFromCache("area");
    if (cacheData !== undefined && cacheData.mail !== undefined && cacheData.id !== undefined && cacheData.password !== undefined) {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        try {
            fetch(cacheData.ip + "/check/auth/" + cacheData.id, requestOptions).then(response => {
                response.json().then(data => {
                    console.log(data);
                    setUserInformation({
                        mail: cacheData.mail,
                        locationAccept: props.userInformation.locationAccept,
                        coord: {
                            latitude: props.userInformation.coord.latitude,
                            longitude: props.userInformation.coord.longitude,
                            city: props.userInformation.coord.city
                        },
                        id: data.uid,
                        services: {
                            spotifyId: props.userInformation.services.spotifyId,
                            googleId: props.userInformation.services.googleId,
                            twitterId: props.userInformation.services.twitterId,
                            twitchId: props.userInformation.services.twitchId,
                            stravaId: props.userInformation.services.stravaId
                        },
                        ip: cacheData.ip
                    }
                    )
                })
            })
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("no cache");
        throw new Error("no cache");
    }
    console.log("cache loaded")
}
