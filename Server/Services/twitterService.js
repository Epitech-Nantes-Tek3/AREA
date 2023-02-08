const firebaseFunctions = require('../firebaseFunctions')
const LoginWithTwitter = require('login-with-twitter');
const { TwitterApi } = require('twitter-api-v2')

/**
 * @brief uses the Twitter API to perform different actions depending on the action argument. Depending on 
 * the value of action, the function can send a tweet, search for tweets and like or retweet them.
 * @param {*} req is an object that contains information about the HTTP request that called this function
 * @param {*} res is an object that handles the HTTP response that will be sent to the user.
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
 */
async function carryOutAnAction(appKey, appSecret, bearer, hashtagOrMessage, action, userData) {
    console.log('userData:', userData)
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
* @brief allows the user to perform an action (retweet, like or tweet) on Twitter.
* It first retrieves the Twitter API data from Firebase using "getDataFromFireBaseServer" function.
* Then, depending on the action passed as a parameter, it calls "carryOutAnAction" function to carry out the specified action.
* @param {string} action is the action to be performed (retweet, like or tweet)
* @param {string} hashtagOrMessage is the hashtag or message associated with the action
* @param {string} uid is the user id
* @param {*} req is an object that contains information about the HTTP request that called this function
* @param {*} res is an object that handles the HTTP response that will be sent to the user.
*/
function GetIdTwitter(uid) {
    return new Promise((resolve, reject) => {
        firebaseFunctions.getDataFromFireBase(uid, 'TwitterService')
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            console.log(error);
        });
    });
}
/**
* @brief allows the user to perform an action (retweet, like, or tweet) on Twitter. It retrieves the necessary information
* from the Twitter API stored on Firebase. Depending on the action passed as a parameter, it calls the
* "carryOutAnAction" function to perform the action.
* @param {string} action is the desired action to be performed (retweet, like, or tweet)
* @param {string} hashtagOrMessage is the hashtag or message to be used for the action
* @param {*} req is an object that contains information about the HTTP request that called this function
* @param {*} res is an object that handles the HTTP response that will be sent to the user.
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
     * @brief uses an external "LoginWithTwitter" package to connect a user to their Twitter account.retrieves the 
     * application key and application secret information from Firebase and uses it for "tw" of "LoginWithTwitter". 
     * Then, it uses the "login" function of "tw" to redirect the user to a Twitter authorization URL.
    * @param {*} req is an object that contains information about the HTTP request that called this function
    * @param {*} res is an object that handles the HTTP response that will be sent to the user.
     */
    loginTwitter: function(req, res) {
        firebaseFunctions.getDataFromFireBaseServer('twitter')
        .then(data => {
            console.log(data)
            const tw = new LoginWithTwitter({
                consumerKey: data.appKey,
                consumerSecret: data.appSecret,
                callbackUrl: 'http://localhost:8080/twitter/sign'
            })
            req.session.tw = tw
            tw.login((err, tokenSecret, url) => {
                if (err) {
                    res.send('ERROR')
                    console.log(err)
                }
                req.session.tokenSecret = tokenSecret
                res.redirect(url)
            })
        })
        .catch(error => {
            console.log(error);
        });
    },
    /**
     * @brief makes sure the user is logged in by checking if "req.session.user" exists. If so, it renders 
     * the "dash" view to display the dash page.
     * @param {*} req is an object that contains information about the HTTP request that called this function
     * @param {*} res is an object that handles the HTTP response that will be sent to the user.
     */
    dashTwitter: function(req, res) {
        if (req.session.user) {
            console.log(req.session)
            res.render('dash')
        } else {
            res.redirect('/twitter')
        }
    },
    /**
     * @brief is used to process Twitter information after the user has logged into their account. It retrieves the 
     * parameters the tokens from the user's request, and those from the api on firebase. Use "tw" for the "callback" 
     * function. If this function succeeds, it stores the user's information in the session, then redirects dash.
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
            tw.callback(params, req.session.tokenSecret, (err, user) => {
                req.session.user = user
                res.redirect('/twitter/dash')
            })
        })
        .catch(error => {
            console.log(error);
        });
    },
    /**
     * @brief allows the user to post a tweet. It first checks if there is a "req.session.user". 
     * Then it uses the "carryOutAnAction" function to post a tweet with the message content.
     * @param {*} req is an object that contains information about the HTTP request that called this function
     * @param {*} res is an object that handles the HTTP response that will be sent to the user.
     */
    sendTweet: function(req, res) {
        if (req.session.user) {
            firebaseFunctions.getDataFromFireBaseServer('twitter')
            .then(data => {
                carryOutAnAction(req, res, data.appKey, data.appSecret, data.bearer, 'hi !', 'tweet');
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            res.redirect('/twitter')
        }
    },
    /**
     * @brief allows the user to retweet the most recent tweet of the hashtag pass parameter. It first checks 
     * if user exist then it uses  "carryOutAnAction" function to retweet newest tweet of the hashtag.
     * @param {*} req is an object that contains information about the HTTP request that called this function
     * @param {*} res is an object that handles the HTTP response that will be sent to the user.
     */
    putlike: function(req, res) {
        if (req.session.user) {
            firebaseFunctions.getDataFromFireBaseServer('twitter')
            .then(data => {
                carryOutAnAction(req, res, data.appKey, data.appSecret, data.bearer, '#chelsea', 'like');
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            res.redirect('/twitter')
        }
    },
    /**
     * @brief allows the user to like the most recent tweet of the hashtag pass parameter. It first checks 
     * if user exist then it uses  "carryOutAnAction" function to like newest tweet of the hashtag.
     * @param {*} req is an object that contains information about the HTTP request that called this function
     * @param {*} res is an object that handles the HTTP response that will be sent to the user.
     */
    putRetweet: function(req, res) {
        if (req.session.user) {
            firebaseFunctions.getDataFromFireBaseServer('twitter')
            .then(data => {
                carryOutAnAction(req, res, data.appKey, data.appSecret, data.bearer, '#chelsea', 'retweet');
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            res.redirect('/twitter')
        }
    },
    /**
    * @brief ActionTw function is used to perform a specified action on the user's Twitter account. It first retrieves the Twitter UID
    * of the user with the "GetIdTwitter" function, then it performs the specified action on the user's account with the "doAct" function.
    * @param {string} action is a string representing the desired action to be performed (e.g. retweet, like, tweet)
    * @param {string} hashtagOrMessage is a string representing the hashtag or message for the desired action.
    * @param {string} uid is the unique identifier for the user on the app.
    * @param {*} req is an object that contains information about the HTTP request that called this function
    * @param {*} res is an object that handles the HTTP response that will be sent to the user.
    */
    ActionTw: function(action, hashtagOrMessage, uid) {
        GetIdTwitter(uid)
        .then(data => {
            doAct(action, hashtagOrMessage, data)
        })
        .catch(error => {
            console.log(error);
        });
    }
}