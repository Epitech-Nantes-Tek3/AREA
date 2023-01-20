const nodemailer = require('nodemailer')
const  { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const dbRealTime = require('./../RealTimeDB')

//receive a text. Sends it with the user mail ID of the configGmail.js to recipient of the configGmail.js .
module.exports = {
    send_mail: function(mail_content, uid) {
        //read in DB
        dbRealTime.getDataFromFireBase(uid, 'GoogleService')
        .then(data => {

            //required to obtain an access token
            const OAuth2_client = new OAuth2(data.cliendId, data.clientSecret)
            OAuth2_client.setCredentials( {refresh_token : data.refreshToken})
            const accessToken = OAuth2_client.getAccessToken()

            // content of configGmail.js required by nodemailer
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAUTH2',
                    user: data.user,
                    clientId: data.cliendId,
                    clientSecret: data.clientSecret,
                    refreshToken: data.refreshToken,
                    accessToken: accessToken
                }
            })

            //content of the mail
            const mail_options = {
                from: `AREA BOT <${data.user}>`,
                to: data.recipient,
                subject: 'AREA poc test',
                text: get_html_message(mail_content)
            }
            //send with nodemailer
            transport.sendMail(mail_options, function(error, res) {
                if (error) {
                    console.log('Error: ', error)
                }
                transport.close()
            })
        })
        .catch(error => {
            console.log(error);
        });
    }
}

// returns the text sent in mail format

function get_html_message(mail_content) {
    return `${mail_content}`
}