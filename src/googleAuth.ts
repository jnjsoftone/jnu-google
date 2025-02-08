import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { loadJson, saveJson } from 'jnu-abc';

// scopeDir: Apis/google/spec
const getScopes = ({ user = 'bigwhitekmc', sn = 0, scopeDir = '' } = {}) => {
  return scopeDir
    ? loadJson(`${scopeDir}/scopes_${user}_${sn}.json`) ?? loadJson(`${scopeDir}/scopes_default.json`)
    : {};
};

export class GoogleAuth {
  tokenPath: string = '';
  crendentialsPath: string = '';
  scopes: string[];

  constructor({ user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = '', authDir = '' } = {}) {
    this.scopes = getScopes({ user, sn, scopeDir });
    switch (type) {
      case 'oauth2':
        this.tokenPath = `${authDir}/token_${user}_${sn}.json`;
        this.crendentialsPath = `${authDir}/${type}_${user}_${sn}.json`;
    }
  }

  async loadSavedCredentialsIfExist() {
    try {
      const credentials = loadJson(this.tokenPath);
      if (!credentials) return null;

      // OAuth2 클라이언트 직접 생성
      const keys = loadJson(this.crendentialsPath);
      const key = keys.installed || keys.web;
      
      const client = new OAuth2Client({
        clientId: key.client_id,
        clientSecret: key.client_secret,
        redirectUri: key.redirect_uris[0]
      });

      // 저장된 토큰으로 인증 정보 설정
      client.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        expiry_date: credentials.expiry_date,
        token_type: 'Bearer'
      });

      return client;
    } catch (err) {
      console.error('Error loading credentials:', err);
      return null;
    }
  }

  async saveCredentials(client: OAuth2Client) {
    try {
      const keys = loadJson(this.crendentialsPath);
      const key = keys.installed || keys.web;
      
      const payload = {
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
        access_token: client.credentials.access_token,
        expiry_date: client.credentials.expiry_date,
        token_type: 'Bearer'
      };
      
      saveJson(this.tokenPath, payload);
    } catch (err) {
      console.error('Error saving credentials:', err);
      throw err;
    }
  }

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