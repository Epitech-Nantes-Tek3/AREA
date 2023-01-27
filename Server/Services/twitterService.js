const firebaseFunctions = require('../firebaseFunctions')
const LoginWithTwitter = require('login-with-twitter');
const { TwitterApi } = require('twitter-api-v2')


//Get app token & user token, use twitter-api-v2 to send message
async function tweet(req, res, appKey, appSecret, message) {
    const client = new TwitterApi ({
        appKey: appKey,
        appSecret: appSecret,
        accessToken: req.session.user.userToken,
        accessSecret: req.session.user.userTokenSecret
    })

    const twClient = client.readWrite;
    try {
        await twClient.v2.tweet(message)
    } catch (e) {
        console.log(e)
    }
    res.redirect('/twitter/dash')
}

//Get app token & user token,and used bearer to search for the last tweet concerning the hashtag passed in argument. The tweet will then be retweeted
async function retweet(req, res, appKey, appSecret, bearer, hashtag) {
    const client = new TwitterApi ({
        appKey: appKey,
        appSecret: appSecret,
        accessToken: req.session.user.userToken,
        accessSecret: req.session.user.userTokenSecret
    })
    const TwBearer = new TwitterApi(bearer);
    const twitterBearer = TwBearer.readOnly;
    const whereTakenTweets = await twitterBearer.v2.search(hashtag);
    const tweetID = whereTakenTweets.data.meta.newest_id;
    await client.v2.retweet(req.session.user.userId , tweetID);
    res.redirect('/twitter/dash')
}


//Get app token & user token,and used bearer to search for the last tweet concerning the hashtag passed in argument. The tweet will then be liked
async function like(req, res, appKey, appSecret, bearer, hashtag) {
    const client = new TwitterApi ({
        appKey: appKey,
        appSecret: appSecret,
        accessToken: req.session.user.userToken,
        accessSecret: req.session.user.userTokenSecret
    })
    const TwBearer = new TwitterApi(bearer);
    const twitterBearer = TwBearer.readOnly;
    const whereTakenTweets = await twitterBearer.v2.search(hashtag);
    const tweetID = whereTakenTweets.data.meta.newest_id;
    await client.v2.like(req.session.user.userId , tweetID);
    res.redirect('/twitter/dash')
}

module.exports = {
    loginTwitter: function(req, res) {
        firebaseFunctions.getDataFromFireBase('twitter', '')
        .then(data => {
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
    dashTwitter: function(req, res) {
        if (req.session.user) {
            res.render('dash')
        } else {
            res.redirect('/twitter')
        }
    },
    signTwitter: function(req, res) {
        var params = {
            oauth_token: req.query.oauth_token,
            oauth_verifier: req.query.oauth_verifier
        }
        firebaseFunctions.getDataFromFireBase('twitter', '')
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
    sendTweet: function(req, res) {
        firebaseFunctions.getDataFromFireBase('twitter', '')
        .then(data => {
            const tw = new LoginWithTwitter({
                consumerKey: data.appKey,
                consumerSecret: data.appSecret,
                callbackUrl: 'http://localhost:8080/twitter/sign'
            
            })
            tweet(req, res, data.appKey, data.appSecret, 'hi !');
        })
        .catch(error => {
            console.log(error);
        });
    },
    putlike: function(req, res) {
        firebaseFunctions.getDataFromFireBase('twitter', '')
        .then(data => {
            const tw = new LoginWithTwitter({
                consumerKey: data.appKey,
                consumerSecret: data.appSecret,
                callbackUrl: 'http://localhost:8080/twitter/sign'
            
            })
            like(req, res, data.appKey, data.appSecret, data.bearer, '#zywoo');
        })
        .catch(error => {
            console.log(error);
        });
    },
    putRetweet: function(req, res) {
        firebaseFunctions.getDataFromFireBase('twitter', '')
        .then(data => {
            const tw = new LoginWithTwitter({
                consumerKey: data.appKey,
                consumerSecret: data.appSecret,
                callbackUrl: 'http://localhost:8080/twitter/sign'
            
            })
            retweet(req, res, data.appKey, data.appSecret, data.bearer, '#zywoo');
        })
        .catch(error => {
            console.log(error);
        });
    }
}