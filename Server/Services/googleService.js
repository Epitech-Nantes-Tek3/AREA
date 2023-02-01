const nodemailer = require('nodemailer')
const  { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const firebaseFunctions = require('../firebaseFunctions')

module.exports = {
    /**
     * brief Sends an email using Gmail with Nodemailer. It first reads in the Firebase database. Then it uses 
     * an OAuth2 library to get an access token from Google. It configures the content of the email and uses the 
     * Nodemailer library to send the email. 
     * @param {*} mail_content content of the mail
     * @param {*} subject mail subject
     * @param {*} userName Name of the issuer
     * @param {*} uid the user's uid
     */
    send_mail: function(mail_content, subject, userName, uid) {
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
                from: `${userName} <${data.user}>`,
                to: data.recipient,
                subject: subject,
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
    }
}

function get_html_message(mail_content) {
    return `${mail_content}`
}