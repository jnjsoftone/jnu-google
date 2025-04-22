import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { loadJsonFromGithub, saveJsonToGithub } from 'jnu-cloud';

// github config (환경설정 macos: .zshrc / windows:  시스템 환경변수)
const { ENV_GITHUB_OWNER, ENV_GITHUB_REPO, ENV_GITHUB_TOKEN } = process.env;
// const ENV_GITHUB_API_URL = 'https://api.github.com';

const githubConfig = {
  owner: ENV_GITHUB_OWNER || "",
  repo: ENV_GITHUB_REPO || "",
  token: ENV_GITHUB_TOKEN || "",
};

// Storage에서 JSON 파일 읽기 함수
const loadJsonFromStorage = async (path: string): Promise<any> => {
  return loadJsonFromGithub(path, githubConfig)
};

// Storage에 JSON 파일 저장 함수
const saveJsonToStorage = async (path: string, data: any) => {
  saveJsonToGithub(path, data, githubConfig)
};

// getScopes를 비동기 함수로 수정
const getScopes = async ({ user = 'bigwhitekmc', sn = 0, scopeDir = '' } = {}): Promise<string[]> => {
  const scopes = scopeDir
    ? await loadJsonFromStorage(`${scopeDir}scopes_${user}_${sn}.json`) ?? 
      await loadJsonFromStorage(`${scopeDir}scopes_default.json`)
    : [];
  console.log('Loaded scopes:', scopes);
  return scopes as string[];
};

export class GoogleAuth {
  tokenPath: string = '';
  crendentialsPath: string = '';
  scopes: string[];

  constructor({ user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = 'Apis/google/spec', authDir = 'Apis/google' } = {}) {
    console.log('Initializing GoogleAuth with:', { user, type, sn, scopeDir, authDir });
    this.scopes = [];
    switch (type) {
      case 'oauth2':
        this.tokenPath = `${authDir}token_${user}_${sn}.json`.replace(/^\//, '');
        this.crendentialsPath = `${authDir}${type}_${user}_${sn}.json`.replace(/^\//, '');
    }
    console.log('Paths:', { tokenPath: this.tokenPath, credentialsPath: this.crendentialsPath });
  }

  // 초기화를 위한 별도 메서드
  async init({ user = 'bigwhitekmc', sn = 0, scopeDir = '' } = {}) {
    this.scopes = await getScopes({ user, sn, scopeDir });
    return this;
  }

  async loadSavedCredentialsIfExist() {
    try {
      console.log('Loading credentials from:', this.tokenPath);
      const credentials: any = await loadJsonFromStorage(this.tokenPath);
      console.log('Loaded credentials:', credentials ? '(exists)' : '(not found)');
      
      if (!credentials) {
        console.log('No credentials found');
        return null;
      }

      console.log('Loading OAuth2 keys from:', this.crendentialsPath);
      const keys: any = await loadJsonFromStorage(this.crendentialsPath);
      
      if (!keys) {
        console.log('No OAuth2 keys found');
        return null;
      }
      
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
      const keys: any = await loadJsonFromStorage(this.crendentialsPath);
      
      if (!keys) {
        console.error('OAuth2 keys not found');
        throw new Error('OAuth2 keys not found');
      }
      
      const key = keys.installed || keys.web;
      
      if (!client.credentials.refresh_token) {
        console.log('No refresh token in credentials, keeping existing one');
        const existingCredentials: any = await loadJsonFromStorage(this.tokenPath);
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
      await saveJsonToStorage(this.tokenPath, payload);
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