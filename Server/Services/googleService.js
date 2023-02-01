const nodemailer = require('nodemailer')
const  { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const firebaseFunctions = require('../firebaseFunctions')


module.exports = {
    /**
    * send_mail is a function that sends an email using the Gmail API. 
    * @param {*} mailContent - Content of the email. 
    * @param {*} subject - Subject of the email.
    * @param {*} userName - Sender's name.
    * @param {*} uid - User ID to fetch user data from the database. 
    */
    send_mail: function(mailContent, subject, userName, uid) {
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
G
function get_html_message(mailContent) {
    return `${mailContent}`
}