var fs = require('fs');
global.XMLHttpRequest = require('xhr2');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized clientassets.
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
        //static
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1l31WAiuaGKtXxL1AK2aeabpFiBiLzWBY0qiha_rIbP8
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  getLang(sheets, 'Common!B2:F9999', 'Common');
}

function getLang(sheets, range, namespace) {
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: '1l31WAiuaGKtXxL1AK2aeabpFiBiLzWBY0qiha_rIbP8',
      range,
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows && rows.length) {
        loadJSON(rows, namespace);
      } else {
        console.log('No data found.');
      }
    },
  );
}

const LANGUAGES = ['en', 'vi', 'cn', 'tw'];
// Call to function with anonymous callback
function loadJSON(data, namespace) {
  const langHolder = { vi: {}, en: {}, cn: {}, tw: {} };
  data.map((item) => {
    LANGUAGES.map((lang, key) => {
      langHolder[lang][item[0]] = item[key + 1];
    });
  });

  LANGUAGES.forEach((lang) => {
    fs.writeFileSync(`core/languages/locales/${lang}/${namespace}.json`, JSON.stringify(langHolder[lang], null, 4));
  });
}
