// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules

import Path from 'path';

// ? External Modules
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

// ? UserMade Modules
import { loadJson, saveJson } from '../base/index.js';


// & Variable AREA
// &---------------------------------------------------------------------------

// scopeDir: Apis/google/spec
const getScopes = ({user = 'bigwhitekmc', sn = 0, scopeDir = ''} = {}) => {
  return scopeDir ? loadJson(`${scopeDir}/scopes_${user}_${sn}.json`)?? loadJson(`${scopeDir}/scopes_default.json`) : {};
};

// & Class AREA
// &---------------------------------------------------------------------------
export class GoogleAuth {
  tokenPath: string = '';
  crendentialsPath: string = '';
  scopes: string[];
  // client; // OAuth2Client

  // & CONSTRUCTOR
  // apiKey(Google API Key) | oauth2(Google OAuth 2.0 Client ID) | serviceAccount(Google Service Account)
  // <type>_<user>_<sn>.json   oauth2: gsa_mooninlearn_0
  constructor({user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = '', authDir = ''} = {}) {
    this.scopes = getScopes({user, sn, scopeDir});
    switch (type) {
      case 'oauth2':
        this.tokenPath = `${authDir}/token_${user}_${sn}.json`;
        this.crendentialsPath = `${authDir}/${type}_${user}_${sn}.json`;
    }
  }

  // & AUTHORIZATION
  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async loadSavedCredentialsIfExist() {
    try {
      return await google.auth.fromJSON(JSON.parse(loadJson(this.tokenPath)));
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(client: any) {
    const keys = loadJson(this.crendentialsPath);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      expiry_date: client.credentials.expiry_date,
      refresh_token: client.credentials.refresh_token,
    });
    saveJson(this.tokenPath, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   */
  async authorize() {
    let client: any = await this.loadSavedCredentialsIfExist();
    if (client) {
      // Check if the token is expired
      const isExpired =
        client.credentials.expiry_date &&
        Date.now() >= client.credentials.expiry_date;
      if (isExpired) {
        console.log('Token has expired, refreshing...');
        client = await this.refreshAccessToken(client);
      }
      return client;
    }
    client = await authenticate({
      scopes: this.scopes,
      keyfilePath: this.crendentialsPath,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  async refreshAccessToken(client: any) {
    const { token } = await client.getAccessToken();
    client.credentials.access_token = token;
    client.credentials.expiry_date = Date.now() + 3600 * 1000; // 1 hour from now
    await this.saveCredentials(client);
    return client;
  }
}
