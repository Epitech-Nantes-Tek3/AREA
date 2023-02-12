import { getAllCacheData } from '../CacheManagement'

/**
 * It checks if the user has a cache, if so, it returns the page, if not, it
 * returns the auth page
 * @param page - The page you want to go to.
 * @param props - The props of the page you're on.
 * @returns The page that the user is on.
 */
export async function loginWithCache(page, props) {
    var cacheData = await getAllCacheData();
    if (cacheData !== undefined && cacheData.mail !== undefined) {
        props.userInformation.mail = cacheData.mail;
        return (page);
    } else {
        return ('/auth')
    }
}
