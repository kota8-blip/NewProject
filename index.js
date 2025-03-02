const { google } = require('googleapis');
const keys = require('./credentials.json');

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function writeToSheet() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  
  const spreadsheetId = '16k0vWG3l6HO4F-WBbGaVJG_b3M-b2Srr4QBIBLxOgo0'
  const range = 'シート1!A1';
  const valueInputOption = 'RAW';
  const values = [['Hello, Google Sheets!']];

  const resource = { values };

  try {
    const result = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log(`${result.data.updatedCells} cells updated.`);
  } catch (err){
    console.error('The API returned an error', err);
  }
}

writeToSheet();