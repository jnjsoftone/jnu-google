import { GooglePhoto } from '../esm/googlePhoto.js';
import dotenv from 'dotenv';

const spreadsheetId = '13Y3q2mYpGRIIjD2oJZu5YvLIXkQB0jDaHDICNnLqLgE';
// const googleSheets = new GoogleSheets(spreadsheetId, {user: 'bigwhitekmc', type: 'oauth2', scopeDir: GOOGLE_SCOPE_DIR, authDir: GOOGLE_AUTH_DIR});
const googlePhoto = new GooglePhoto({
  user: 'bigwhitekmc',
  // type: 'oauth2',
  // sn: 0,
  // scopeDir: 'Apis/google/spec/',
  // authDir: 'Apis/google/',
});

const client = await googlePhoto.init();
const albums = await client.getAlbums();
console.log(albums);

// const spreadsheetId = "13Y3q2mYpGRIIjD2oJZu5YvLIXkQB0jDaHDICNnLqLgE";
// // const googleSheets = new GoogleSheets(spreadsheetId, {user: 'bigwhitekmc', type: 'oauth2', scopeDir: 'C:/JnJ-soft/Developments/_Settings/Apis/google/spec', authDir: 'C:/JnJ-soft/Developments/_Settings/Apis/google'});
// const googleSheets = new GoogleSheets(spreadsheetId, {user: 'bigwhitekmc', type: 'oauth2'});
