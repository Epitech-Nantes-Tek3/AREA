/**
 * GoogleService module
 * @module GoogleService
 */

/**
 * @constant nodemailer
 * @requires nodemailer
 */
const nodemailer = require('nodemailer')

/**
 * @constant {google}
 * @requires googleapis
 */
const  { google } = require('googleapis')

/**
 * @constant firebaseFunctions
 * @requires firebaseFunctions
 */
const firebaseFunctions = require('../firebaseFunctions')

/**
 * @constant OAuth2
 * @requires google.auth.OAuth2
 */
const OAuth2 = google.auth.OAuth2

module.exports = {
    /**
     * UNUSED PARAMETER: subject
     * Sends an email using Gmail with Nodemailer. It first reads in the Firebase database. Then it uses
     * an OAuth2 library to get an access token from Google. It configures the content of the email and uses the
     * Nodemailer library to send the email.
     * @function send_mail
     * @param {*} subject Unnecessary but mandatory for areaLoop.
     * @param {*} mailContent Content of the mail
     * @param {*} uid The user's uid
     */
    send_mail: function(uid, subject, mailContent) {
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
    /**
     * Saves the data from google service to the user in the database.
     * @function RegistedRequiredGoogle
     * @param {string} uid - user id
     * @param {Object} res - Express response object
    */
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

/**
 * function called which returns the content of the message in html format.
 * @function get_html_message
 * @param {string} mailContent mailContent is the content of the mail sent.
 * @returns {*} return string message in html format.
*/
function get_html_message(mailContent) {
    return `${mailContent}`
}