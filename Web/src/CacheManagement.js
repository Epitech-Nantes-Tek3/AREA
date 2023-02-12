import { ip } from './env'

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

export function addDataIntoCache (cacheName, url, response) {
    const data = new Response(JSON.stringify(response));
    if ('caches' in window) {
        caches.open(cacheName).then((cache) => {
            console.log("cache: " + JSON.stringify(response));
            cache.put(url, data);
        });
    }
};
