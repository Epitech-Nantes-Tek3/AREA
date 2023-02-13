import { ip } from './env'

/**
 * This function gets all the data from the cache and returns it
 * @returns the cacheData variable.
 */
export async function getAllCacheData() {
    var cacheData;
    var url = {ip}
    const cacheStorage = await caches.open("area");
    const cachedResponse = await cacheStorage.match(url);
    try {
        var data = await cachedResponse.json();
        console.log("data: " + JSON.stringify(data));
        cacheData = data;
    }
    catch (error) {
        console.log("error" + error);
    }
    return cacheData;
};

/**
 * It takes a cache name, a URL, and a response, and then it adds the response to
 * the cache
 * @param cacheName - The name of the cache to store the data in.
 * @param url - The URL of the data to be cached.
 * @param response - The response object that you want to cache.
 */
export function addDataIntoCache (cacheName, url, response) {
    const data = new Response(JSON.stringify(response));
    if ('caches' in window) {
        caches.open(cacheName).then((cache) => {
            console.log("cache: " + JSON.stringify(response));
            cache.put(url, data);
        });
    }
};
