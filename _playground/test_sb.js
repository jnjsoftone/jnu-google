import { GoogleSheets } from '../esm/googleSheets.js';
import dotenv from 'dotenv';

const spreadsheetId = '13Y3q2mYpGRIIjD2oJZu5YvLIXkQB0jDaHDICNnLqLgE';
// const googleSheets = new GoogleSheets(spreadsheetId, {user: 'bigwhitekmc', type: 'oauth2', scopeDir: GOOGLE_SCOPE_DIR, authDir: GOOGLE_AUTH_DIR});
const googleSheets = new GoogleSheets(spreadsheetId, {
  user: 'bigwhitekmc',
  type: 'oauth2',
  scopeDir: '',
  authDir: '',
});

const client = await googleSheets.init();
const names = await googleSheets.getSheetNames();
console.log(names);

