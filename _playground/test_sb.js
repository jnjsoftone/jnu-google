import { GoogleSheets } from '../esm/googleSheets.js';
import dotenv from 'dotenv';
// import { PLATFORM } from 'jnu-abc';
// dotenv.config({ path: `../.env.${PLATFORM}` });

// const { GOOGLE_SCOPE_DIR, GOOGLE_AUTH_DIR } = process.env;

// const GOOGLE_SCOPE_DIR = "/Users/moon/JnJ/Developments/jd-environments/Apis/google/spec";
// const GOOGLE_AUTH_DIR = "/Users/moon/JnJ/Developments/jd-environments/Apis/google";

const spreadsheetId = '13Y3q2mYpGRIIjD2oJZu5YvLIXkQB0jDaHDICNnLqLgE';
// const googleSheets = new GoogleSheets(spreadsheetId, {user: 'bigwhitekmc', type: 'oauth2', scopeDir: GOOGLE_SCOPE_DIR, authDir: GOOGLE_AUTH_DIR});
const googleSheets = new GoogleSheets(spreadsheetId, {
  user: 'bigwhitekmc',
  type: 'oauth2',
  scopeDir: '',
  authDir: '',
});

// oauth2_bigwhitekmc_0.json
// oauth2_bigwhitekmc_0.json

// const spreadsheetId = "14HsVYROe_RDI2zg6C1S8uAYUen4a7wIh0_p7VTtxn-A";
// const googleSheets = new GoogleSheets(spreadsheetId, {user: 'mooninlearn', type: 'oauth2', scopeDir: GOOGLE_SCOPE_DIR, authDir: GOOGLE_AUTH_DIR});

// const spreadsheetId = "1_TA0wR1R7u32cT_iQBGmaXsi4o5zFSZgV2e-0PNz-Zo"
// const googleSheets = new GoogleSheets(spreadsheetId, {user: 'moondevgoog', type: 'oauth2', scopeDir: GOOGLE_SCOPE_DIR, authDir: GOOGLE_AUTH_DIR});

const client = await googleSheets.init();
const names = await googleSheets.getSheetNames();
console.log(names);

// (async ()=> {
//   const client = await googleSheets.init();
//   const names = await googleSheets.getSheetNames();
//   console.log(names);
// })();

// const names = await googleSheets.getSheetNames();
// console.log(names);
