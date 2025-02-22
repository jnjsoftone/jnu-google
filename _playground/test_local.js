import { GoogleSheets } from '../esm/googleSheets.js';
import dotenv from 'dotenv';
// import { PLATFORM } from 'jnu-abc';
// dotenv.config({ path: `../.env.${PLATFORM}` });

// const { GOOGLE_SCOPE_DIR, GOOGLE_AUTH_DIR } = process.env;

const GOOGLE_SCOPE_DIR = "/Users/moon/JnJ/Developments/jd-environments/Apis/google/spec";
const GOOGLE_AUTH_DIR = "/Users/moon/JnJ/Developments/jd-environments/Apis/google";

const spreadsheetId = '13Y3q2mYpGRIIjD2oJZu5YvLIXkQB0jDaHDICNnLqLgE';
// const googleSheets = new GoogleSheets(spreadsheetId, {user: 'bigwhitekmc', type: 'oauth2', scopeDir: GOOGLE_SCOPE_DIR, authDir: GOOGLE_AUTH_DIR});
const googleSheets = new GoogleSheets(spreadsheetId, {
  user: 'bigwhitekmc',
  type: 'oauth2',
  scopeDir: GOOGLE_SCOPE_DIR,
  authDir: GOOGLE_AUTH_DIR,
});


const client = await googleSheets.init();
const names = await googleSheets.getSheetNames();
console.log(names);
