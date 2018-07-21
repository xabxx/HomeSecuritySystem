const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var btoa = require('btoa');
var Base64 = require('js-base64').Base64;

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://mail.google.com/',
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/gmail.compose',
                'https://www.googleapis.com/auth/gmail.modify'];

exports.sub = (event, res) => {
  var creds = //TODO: fill in with your creds
  authorize(JSON.parse(creds), sendMessage);
  res.send('Sent alert.');
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  var token = //TODO: fill in with your token
  oAuth2Client.setCredentials(JSON.parse(token));
  callback(oAuth2Client);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Send text message through AT&T sms gateway.
 * The first three variables can be changed so that the alert message can be personalized.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function sendMessage(auth) {
  var to = //TODO: your phone number and + '@txt.att.net' (or change to your carrier's sms gateway);
  var subject = 'ALERT';
  var content = 'Intruder Alert!';

  var email =
    "From: 'me'\r\n" +
    "To: " + to + "\r\n" +
    "Subject: " + subject + "\r\n" +
    "Content-Type: text/html; charset=utf-8\r\n" +
    "Content-Transfer-Encoding: quoted-printable\r\n\r\n" +
          content;
  var base64EncodedEmail = btoa(email)
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': base64EncodedEmail
    }
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err)}
  );
}
