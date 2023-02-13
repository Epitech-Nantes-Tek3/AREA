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
    add_event: function(res, uid) {
      firebaseFunctions.getDataFromFireBase(uid, 'GoogleService')
        .then(data => {

          const OAuth2_client = new OAuth2(data.clientId, data.clientSecret)
          OAuth2_client.setCredentials( {refresh_token : data.refreshToken})
          const accessToken = OAuth2_client.getAccessToken()

          var auth = {
              type: 'OAUTH2',
              user: data.user,
              clientId: data.clientId,
              clientSecret: data.clientSecret,
              refreshToken: data.refreshToken,
              accessToken: accessToken
          }

          const calendar = google.calendar({ version: 'v3', auth });

          var event = {
            summary: 'AREA Event',
            location: '5 rue dAlger',
            description: "EPITECH Project",
            start: {
              dateTime: '2023-01-09T09:00:00-07:00',
              timeZone: 'America/Los_Angeles'
            },
            end: {
              dateTime: '2023-03-01T10:00:00-07:00',
              timeZone: 'America/Los_Angeles'
            },
            recurrence: ['RRULE:FREQ=DAILY;COUNT=1'],
            attendees: [{ email: 'area.poc@gmail.com' }],
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 10 }
              ]
            }
          };

          calendar.events.insert(
            {
              calendarId: 'primary',
              resource: event
            },
            function(err, event) {
              if (err) {
                console.log(
                  'There was an error contacting the Calendar service: ' + err
                );
                return;
              }
              console.log('Event created: %s', event.data.htmlLink);
            }
          );

        }).catch(error => {
        console.log(error);
    });
  },
    /**
     * UNDOCUMENTED
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
 * UNDOCUMENTED
 */
function get_html_message(mailContent) {
    return `${mailContent}`
}