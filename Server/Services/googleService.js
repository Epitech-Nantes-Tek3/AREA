const nodemailer = require('nodemailer')
const  { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const firebaseFunctions = require('../firebaseFunctions')

module.exports = {
    /**
     * brief Sends an email using Gmail with Nodemailer. It first reads in the Firebase database. Then it uses 
     * an OAuth2 library to get an access token from Google. It configures the content of the email and uses the 
     * Nodemailer library to send the email. 
     * @param {*} mailContent Content of the mail
     * @param {*} subject Unnecessary but mandatory for areaLoop.
     * @param {*} userName Name of the issuer
     * @param {*} uid The user's uid
     * @param {*} req Unnecessary but mandatory for areaLoop.
     * @param {*} res Unnecessary but mandatory for areaLoop.
     */
    send_mail: function(subject, mailContent, uid) {
        firebaseFunctions.getDataFromFireBase(uid, 'GoogleService')
        .then(data => {
            const OAuth2_client = new OAuth2(data.clientId, data.clientSecret)
            OAuth2_client.setCredentials( {refresh_token : data.refreshToken})
            const accessToken = OAuth2_client.getAccessToken()

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAUTH2',
                    user: data.user,
                    clientId: data.clientId,
                    clientSecret: data.clientSecret,
                    refreshToken: data.refreshToken,
                    accessToken: accessToken
                }
            })

            const mail_options = {
                from: `'AREA BOT' <${data.user}>`,
                to: data.recipient,
                subject: `Area Message`,
                text: get_html_message(mailContent)
            }
            transport.sendMail(mail_options, function(error, res) {
                if (error) {
                    console.log('Error: ', error)
                }
                console.log('mail correctly sent')
                transport.close()
            })
        })
        .catch(error => {
            console.log(error);
        });
    },
    RegistedRequiredGoogle: function(uid, res) {
        firebaseFunctions.getDataFromFireBaseServer('GoogleService')
        .then(data => {
            firebaseFunctions.getDataFromFireBase(uid, "")
            .then((userdata) => {
                var information = data
                information.recipient = userdata.email
                firebaseFunctions.setDataInDb(`USERS/${uid}/GoogleService`, information)
                res.json({body: "OK"}).status(200);
            }).catch((error) => {
                console.log(error);
                res.json({body: "Error"}).status(400);
            })
        })
        .catch(error => {
            console.log(error);
            res.json({body: "Error"}).status(400);
        });
    }
}

function get_html_message(mailContent) {
    return `${mailContent}`
}