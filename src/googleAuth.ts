import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { loadJson, saveJson } from 'jnu-abc';

// scopeDir: Apis/google/spec
const getScopes = ({ user = 'bigwhitekmc', sn = 0, scopeDir = '' } = {}) => {
  const scopes = scopeDir
    ? loadJson(`${scopeDir}/scopes_${user}_${sn}.json`) ?? loadJson(`${scopeDir}/scopes_default.json`)
    : {};
  console.log('Loaded scopes:', scopes);
  return scopes;
};

export class GoogleAuth {
  tokenPath: string = '';
  crendentialsPath: string = '';
  scopes: string[];

  constructor({ user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = '', authDir = '' } = {}) {
    console.log('Initializing GoogleAuth with:', { user, type, sn, scopeDir, authDir });
    this.scopes = getScopes({ user, sn, scopeDir });
    switch (type) {
      case 'oauth2':
        this.tokenPath = `${authDir}/token_${user}_${sn}.json`;
        this.crendentialsPath = `${authDir}/${type}_${user}_${sn}.json`;
    }
    console.log('Paths:', { tokenPath: this.tokenPath, credentialsPath: this.crendentialsPath });
  }

  async loadSavedCredentialsIfExist() {
    try {
      console.log('Loading credentials from:', this.tokenPath);
      const credentials = loadJson(this.tokenPath);
      console.log('Loaded credentials:', credentials ? '(exists)' : '(not found)');
      
      if (!credentials) {
        console.log('No credentials found');
        return null;
      }

      console.log('Loading OAuth2 keys from:', this.crendentialsPath);
      const keys = loadJson(this.crendentialsPath);
      const key = keys.installed || keys.web;
      console.log('OAuth2 key loaded:', key ? '(exists)' : '(not found)');

      if (!key || !key.client_id || !key.client_secret) {
        console.log('Invalid OAuth2 keys');
        return null;
      }
      
      const client = new OAuth2Client({
        clientId: key.client_id,
        clientSecret: key.client_secret,
        redirectUri: key.redirect_uris[0]
      });

      // 토큰 정보를 명시적으로 설정
      const token = {
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        scope: this.scopes.join(' '),
        token_type: credentials.token_type || 'Bearer',
        expiry_date: credentials.expiry_date
      };

      console.log('Setting credentials with token:', { 
        hasAccessToken: !!token.access_token,
        hasRefreshToken: !!token.refresh_token,
        scope: token.scope,
        tokenType: token.token_type,
        expiryDate: token.expiry_date ? new Date(token.expiry_date).toISOString() : 'not set'
      });

      client.setCredentials(token);

      // 토큰이 만료되었거나 곧 만료될 예정이면 자동으로 갱신
      const expiryDate = token.expiry_date;
      const isExpired = expiryDate ? Date.now() >= expiryDate - 30000 : true;
      
      if (isExpired && token.refresh_token) {
        console.log('Token is expired or about to expire, refreshing...');
        try {
          const { credentials: newCredentials } = await client.refreshAccessToken();
          client.setCredentials(newCredentials);
          await this.saveCredentials(client);
          console.log('Token refreshed successfully');
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          if (!credentials.refresh_token) {
            console.log('No refresh token available, authentication required');
            return null;
          }
        }
      }

      return client;
    } catch (err) {
      console.error('Error loading credentials:', err);
      return null;
    }
  }

  async saveCredentials(client: OAuth2Client) {
    try {
      console.log('Saving credentials...');
      const keys = loadJson(this.crendentialsPath);
      const key = keys.installed || keys.web;
      
      if (!client.credentials.refresh_token) {
        console.log('No refresh token in credentials, keeping existing one');
        const existingCredentials = loadJson(this.tokenPath);
        if (existingCredentials?.refresh_token) {
          client.credentials.refresh_token = existingCredentials.refresh_token;
        }
      }
      
      const payload = {
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
        access_token: client.credentials.access_token,
        scope: this.scopes.join(' '),
        token_type: client.credentials.token_type || 'Bearer',
        expiry_date: client.credentials.expiry_date
      };
      
      console.log('Saving credentials to:', this.tokenPath);
      saveJson(this.tokenPath, payload);
      console.log('Credentials saved successfully');
    } catch (err) {
      console.error('Error saving credentials:', err);
      throw err;
    }
  }

  async authorize() {
    console.log('Starting authorization process...');
    let client = await this.loadSavedCredentialsIfExist();
    
    if (client) {
      return client;
    }

    console.log('No valid credentials found, starting new authentication...');
    // 새로운 인증 진행
    client = await authenticate({
      scopes: this.scopes,
      keyfilePath: this.crendentialsPath,
    });

    if (client.credentials) {
      console.log('New authentication successful, saving credentials...');
      await this.saveCredentials(client);
    }
    return client;
  }
}