/**
 * Twitter module
 * @module Twitter
 */

/**
 * It allows to communicate with the firebase DB.
 * @constant firebaseFunctions
 * @requires firebaseFunctions
 */
const firebaseFunctions = require('../firebaseFunctions')

/**
 * It allows to login with twitter.
 * @constant LoginWithTwitter
 * @requires login-with-twitter
 */
const LoginWithTwitter = require('login-with-twitter');

/**
 * It allows to call the Twitter API.
 * @constant {TwitterApi}
 * @requires twitter-api-v2
 */
const { TwitterApi } = require('twitter-api-v2')

/**
 * @class class which contains url and the tokenSecret, as well as the uid of the user.
 */
class TwitterRedirect {
    constructor(url, tokenSecret, uid) {
        this.url = url;
        this.tokenSecret = tokenSecret;
        this.uid = uid
    }
}

/**
 * @var twRedirect
 * @requires TwitterRedirect()
*/
var twRedirect = new TwitterRedirect("any", "any", "any")

/**
 * Uses the Twitter API to perform different actions depending on the action argument. Depending on
 * the value of action, the function can send a tweet, search for tweets and like or retweet them.
 * @function carryOutAnAction
 * @async
 * @param {*} appKey is an application key provided by Twitter to access their API. It is used to identify the
 * application making the request.
 * @param {*} appSecret is an application secret provided by Twitter to access their API. It is used to secure
 * the requests made by the application.
 * @param {*} bearer is an access token that is used to access certain parts of the Twitter API that require
 *  additional authorization.
 * @param {*} hashtagOrMessage is an argument that can be a message or a hashtag depending on the value of the
 * action argument. It is used to send a tweet or to search for tweets.
 * @param {*} action is an argument that determines what action should be performed by the function. It
 * can take the values 'tweet', 'like' or 'retweet'.
 * @param {*} userData required data for TwitterApi
 */
async function carryOutAnAction(appKey, appSecret, bearer, hashtagOrMessage, action, userData) {
    const client = new TwitterApi ({
        appKey: appKey,
        appSecret: appSecret,
        accessToken: userData.userToken,
        accessSecret: userData.userTokenSecret
    })
    if (action == 'tweet') {
        const twClient = client.readWrite;
        try {
            await twClient.v2.tweet(hashtagOrMessage);
            console.log('send tweet')
        } catch (e) {
            console.log(e)
        }
    }
    else {
        const TwBearer = new TwitterApi(bearer);
        const twitterBearer = TwBearer.readOnly;
        try {
            const whereTakenTweets = await twitterBearer.v2.search(hashtagOrMessage);
            console.log(whereTakenTweets.data.meta.newest_id)
            if (action == 'like')
                await client.v2.like(userData.userId , whereTakenTweets.data.meta.newest_id);
            else
                await client.v2.retweet(userData.userId , whereTakenTweets.data.meta.newest_id);
        } catch (e) {
            console.log(e)
        }
    }
}

/**
 * Sets the user data in the Firebase database.
 * @function setUserData
 * @param {Object} twTokens - An object containing the Twitter API tokens.
 * @param {string} uid user ID.
*/
function setUserData(uid ,twTokens) {
    firebaseFunctions.setDataInDb(`USERS/${uid}/twitterService`, twTokens)
}

/**
 * Allows the user to perform an action (retweet, like, or tweet) on Twitter. It retrieves the necessary information
 * from the Twitter API stored on Firebase. Depending on the action passed as a parameter, it calls the
 * "carryOutAnAction" function to perform the action.
 * @function doAct
 * @param {string} action is the desired action to be performed (retweet, like, or tweet)
 * @param {string} hashtagOrMessage is the hashtag or message to be used for the action
 * @param {*} userData required data for TwitterApi
 */

function doAct(action, hashtagOrMessage, userData) {
    firebaseFunctions.getDataFromFireBaseServer('twitter')
    .then(data => {
        if (action === 'retweet')
            carryOutAnAction(data.appKey, data.appSecret, data.bearer, hashtagOrMessage, 'retweet', userData);
        else if (action === 'like')
            carryOutAnAction(data.appKey, data.appSecret, data.bearer, hashtagOrMessage, 'like', userData);
        else if (action === 'tweet')
            carryOutAnAction(data.appKey, data.appSecret, data.bearer, hashtagOrMessage, 'tweet', userData);
    })
    .catch(error => {
        console.log(error);
    });
}

module.exports = {
    /**
     * Uses an external "LoginWithTwitter" package to connect a user to their Twitter account.retrieves the
     * application key and application secret information from Firebase and uses it for "tw" of "LoginWithTwitter".
     * Then, it uses the "login" function of "tw" to redirect the user to a Twitter authorization URL.
     * @function loginTwitter
     * @param {*} req is an object that contains information about the HTTP request that called this function
     * @param {*} res is an object that handles the HTTP response that will be sent to the user.
     * @param {Object} params - An object containing the Twitter API tokens and the User ID.
     */
    loginTwitter: function(req, res, params) {
        const tw = new LoginWithTwitter({
            consumerKey: params.consumerKey,
            consumerSecret: params.consumerSecret,
            callbackUrl: params.callbackUrl
        })
        twRedirect.uid = params.uid
        req.session.tw = tw
        tw.login((err, tokenSecret, url) => {
            if (err) {
                res.send('ERROR')
                console.log(err)
            }
            req.session.tokenSecret = tokenSecret
            twRedirect.url = url
            twRedirect.tokenSecret = tokenSecret
            res.json({body: url}).status(200);
        })
    },
    /**
     * Is used to process Twitter information after the user has logged into their account. It retrieves the
     * parameters the tokens from the user's request, and those from the api on firebase. Use "tw" for the "callback"
     * function. If this function succeeds, it stores the user's information in the session, then redirects dash.
     * @function signTwitter
     * @param {*} req is an object that contains information about the HTTP request that called this function
     * @param {*} res is an object that handles the HTTP response that will be sent to the user.
    */
    signTwitter: function(req, res) {
        var params = {
            oauth_token: req.query.oauth_token,
            oauth_verifier: req.query.oauth_verifier
        }
        firebaseFunctions.getDataFromFireBaseServer('twitter')
        .then(data => {
            const tw = new LoginWithTwitter({
                consumerKey: data.appKey,
                consumerSecret: data.appSecret,
                callbackUrl: 'http://localhost:8080/twitter/sign'
            })
            tw.callback(params, twRedirect.tokenSecret, (err, user) => {
                req.session.user = user
                setUserData(twRedirect.uid, user)
                res.send("SUCCESS ! You can go back to the AREA Application.\n The access token will only last one hour.")
            })
        })
        .catch(error => {
            console.log(error);
        });
    },
    /**
     * ActionTw function is used to perform a specified action on the user's Twitter account. It first retrieves the Twitter UID
     * of the user with the "getDataFromFireBase" function, then it performs the specified action on the user's account with the "doAct" function.
     * @function ActionTw
     * @param {string} action is a string representing the desired action to be performed (e.g. retweet, like, tweet)
     * @param {string} hashtagOrMessage is a string representing the hashtag or message for the desired action.
     * @param {string} uid is the unique identifier for the user on the app.
     */
    ActionTw: function(uid, action, hashtagOrMessage) {
        firebaseFunctions.getDataFromFireBase(uid, "twitterService")
        .then(data => {
            doAct(action, hashtagOrMessage, data)
        })
        .catch(error => {
            console.log(error);
        });
    },
    getRedirect: function() {
        return twRedirect;
    }
}