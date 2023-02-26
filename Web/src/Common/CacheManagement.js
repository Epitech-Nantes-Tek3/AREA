/**
 * @module CacheManagement
 */
/**
 * It takes a cache name as a parameter, gets the data from local storage, parses
 * it, and returns the data
 * @function getDataFromCache - Gets data from the cache
 * @param cacheName - The name of the cache you want to get data from.
 * @returns the data from the cache.
 */
export function getDataFromCache(cacheName) {
    try {
        const data = localStorage.getItem(cacheName);
        if (data) {
            var newData = JSON.parse(data);
            newData.password = atob(newData.password)
            return newData;
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
 * @function addDataIntoCache - Adds data into the cache
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
