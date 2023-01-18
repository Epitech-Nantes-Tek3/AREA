const nodemailer = require('nodemailer')
const  { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const configgmail = require ('./../configGmail')

const OAuth2_client = new OAuth2(configgmail.cliendId, configgmail.clientSecret)
OAuth2_client.setCredentials( {refresh_token : configgmail.refreshToken})

module.exports = {
    send_mail: function(mail_content) {
        const accessToken = OAuth2_client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAUTH2',
                user: configgmail.user,
                clientId: configgmail.cliendId,
                clientSecret: configgmail.clientSecret,
                refreshToken: configgmail.refreshToken,
                accessToken: accessToken
            }
        })

        const mail_options = {
            from: `AREA BOT <${configgmail.user}>`,
            to: configgmail.recipient,
            subject: 'AREA poc test',
            text: get_html_message(mail_content)
        }

        transport.sendMail(mail_options, function(error, res) {
            if (error) {
                console.log('Error: ', error)
            }
            if (error) {
                console.log('Success: ', res)
            }
            transport.close()
        })
    }
}

function get_html_message(mail_content) {
    return `${mail_content}`
}