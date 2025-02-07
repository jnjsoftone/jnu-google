// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules
import Path from 'path';

// ? External Modules
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// ? UserMade Modules
import { loadJson, saveJson } from 'jnu-abc';

// & Variable AREA
// &---------------------------------------------------------------------------

// scopeDir: Apis/google/spec
const getScopes = ({ user = 'bigwhitekmc', sn = 0, scopeDir = '' } = {}) => {
  return scopeDir
    ? loadJson(`${scopeDir}/scopes_${user}_${sn}.json`) ?? loadJson(`${scopeDir}/scopes_default.json`)
    : {};
};

// & Class AREA
// &---------------------------------------------------------------------------
export class GoogleAuth {
  tokenPath: string = '';
  crendentialsPath: string = '';
  scopes: string[];

  // & CONSTRUCTOR
  // apiKey(Google API Key) | oauth2(Google OAuth 2.0 Client ID) | serviceAccount(Google Service Account)
  // <type>_<user>_<sn>.json   oauth2: gsa_mooninlearn_0
  constructor({ user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = '', authDir = '' } = {}) {
    this.scopes = getScopes({ user, sn, scopeDir });
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
      const content = loadJson(this.tokenPath);
      const credentials = JSON.parse(content);
      const client = google.auth.fromJSON(credentials) as OAuth2Client;
      return client;
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(client: OAuth2Client) {
    const keys = JSON.parse(loadJson(this.crendentialsPath));
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
      expiry_date: client.credentials.expiry_date,
    });
    saveJson(this.tokenPath, payload);
  }

  /**
   * Load or request authorization to call APIs.
   */
  async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      try {
        // 토큰이 만료되었거나 만료 30초 전이면 자동으로 갱신
        const expiryDate = client.credentials.expiry_date;
        const isExpired = expiryDate ? Date.now() >= expiryDate - 30000 : false;
        
        if (isExpired) {
          console.log('Token is expired or about to expire, refreshing...');
          const { credentials } = await client.refreshAccessToken();
          client.setCredentials(credentials);
          await this.saveCredentials(client);
        }
        return client;
      } catch (err) {
        console.error('Error refreshing access token:', err);
        // 토큰 갱신 실패 시 새로운 인증 진행
        client = null;
      }
    }

    // 새로운 인증 진행
    client = await authenticate({
      scopes: this.scopes,
      keyfilePath: this.crendentialsPath,
    });

    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }
}