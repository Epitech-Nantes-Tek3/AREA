// import { ip } from '../env'

/**
 * This function gets all the data from the cache and returns it
 * @returns the cacheData variable.
 */
// export async function getAllCacheData() {
//     var cacheData;
//     var url = {ip}
//     const cacheStorage = await caches.open("area");
//     const cachedResponse = await cacheStorage.match(url);
//     try {
//         var data = await cachedResponse.json();
//         console.log("data: " + JSON.stringify(data));
//         cacheData = data;
//     }
//     catch (error) {
//         console.log("error" + error);
//     }
//     return cacheData;
// };

export function getDataFromCache(cacheName) {
    try {
        const data = localStorage.getItem(cacheName);
        if (data) {
            console.log("getDataFromCache: " + data);
            return JSON.parse(data);
        } else {
            console.log("no data in cache");
            return null;
        }
    } catch (error) {
        console.log("error getting cache: " + error);
    }
}

/**
 * It takes a cache name, a URL, and a response, and then it adds the response to
 * the cache
 * @param cacheName - The name of the cache to store the data in.
 * @param url - The URL of the data to be cached.
 * @param response - The response object that you want to cache.
 */
export function addDataIntoCache(cacheName, response) {
    try {
        console.log("addDataIntoCache: " + JSON.stringify(response));
        localStorage.setItem(cacheName, JSON.stringify(response))
    } catch(error) {
        console.log("error adding cache: " + error);
    }
};
