const nodemailer = require('nodemailer')
const  { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const firebaseFunctions = require('../firebaseFunctions')

//receive a text. Sends it with the user mail ID of the configGmail.js to recipient of the configGmail.js .
module.exports = {
    send_mail: function(mail_content, subject, userName, uid) {
        //read in DB
        firebaseFunctions.getDataFromFireBase(uid, 'GoogleService')
        .then(data => {

            //required to obtain an access token
            const OAuth2_client = new OAuth2(data.clientId, data.clientSecret)
            OAuth2_client.setCredentials( {refresh_token : data.refreshToken})
            const accessToken = OAuth2_client.getAccessToken()

            // content of configGmail.js required by nodemailer
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

            //content of the mail
            const mail_options = {
                from: `${userName} <${data.user}>`,
                to: data.recipient,
                subject: subject,
                text: get_html_message(mail_content)
            }
            //send with nodemailer
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
    add_event: function(uid) {
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
              auth: auth,
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
  }
}

// returns the text sent in mail format

function get_html_message(mail_content) {
    return `${mail_content}`
}