const firebaseFunctions = require('../firebaseFunctions')
const LoginWithTwitter = require('login-with-twitter');
const { TwitterApi } = require('twitter-api-v2')

async function carryOutAnAction(req, res, appKey, appSecret, bearer, hashtagOrMessage, action) {
    const client = new TwitterApi ({
        appKey: appKey,
        appSecret: appSecret,
        accessToken: req.session.user.userToken,
        accessSecret: req.session.user.userTokenSecret
    })
    if (action == 'tweet') {
        const twClient = client.readWrite;
        try {
            await twClient.v2.tweet(hashtagOrMessage);
        } catch (e) {
            console.log(e)
            res.redirect('/twitter')
        }
    }
    else {
        const TwBearer = new TwitterApi(bearer);
        const twitterBearer = TwBearer.readOnly;
        try {
            const whereTakenTweets = await twitterBearer.v2.search(hashtagOrMessage);
            if (action == 'like')
                await client.v2.like(req.session.user.userId , whereTakenTweets.data.meta.newest_id);
            else
                await client.v2.retweet(req.session.user.userId , whereTakenTweets.data.meta.newest_id);
        } catch (e) {
            console.log(e)
            res.redirect('/twitter')
        }
    }
    res.redirect('/twitter')
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
        if (req.session.user) {
            firebaseFunctions.getDataFromFireBase('twitter', '')
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
    putlike: function(req, res) {
        if (req.session.user) {
            firebaseFunctions.getDataFromFireBase('twitter', '')
            .then(data => {
                carryOutAnAction(req, res, data.appKey, data.appSecret, data.bearer, '#zywoo', 'like');
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            res.redirect('/twitter')
        }
    },
    putRetweet: function(req, res) {
        if (req.session.user) {
            firebaseFunctions.getDataFromFireBase('twitter', '')
            .then(data => {
                carryOutAnAction(req, res, data.appKey, data.appSecret, data.bearer, '#zywoo', 'retweet');
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            res.redirect('/twitter')
        }
    }
}