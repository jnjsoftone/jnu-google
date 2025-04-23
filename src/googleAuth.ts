import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { loadJsonFromGithub, saveJsonToGithub } from 'jnu-cloud';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

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
const getScopes = async ({ user = 'bigwhitekmc', sn = 0, scopeDir = 'Apis/google/spec/' } = {}): Promise<string[]> => {
  let scopes = scopeDir
    ? await loadJsonFromStorage(`${scopeDir}scopes_${user}_${sn}.json`) ?? 
      await loadJsonFromStorage(`${scopeDir}scopes_default.json`)
    : [];

  // console.log('getScopes Loaded scopes1:', scopes);

  // 스코프가 비어있거나 유효하지 않은 경우 기본값 사용
  if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
    console.log('Invalid or empty scopes detected, using default scopes');
    scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ];
  }
  
  // console.log('Loaded scopes2:', scopes);
  return scopes as string[];
};

export class GoogleAuth {
  tokenPath: string = '';
  crendentialsPath: string = '';
  scopeDir: string = '';
  scopes: string[];

  constructor({ user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = 'Apis/google/spec/', authDir = 'Apis/google/' } = {}) {
    console.log('Initializing GoogleAuth with:', { user, type, sn, scopeDir, authDir });
    this.scopeDir = scopeDir;
    this.scopes = [];
    switch (type) {
      case 'oauth2':
        this.tokenPath = `${authDir}token_${user}_${sn}.json`.replace(/^\//, '');
        this.crendentialsPath = `${authDir}${type}_${user}_${sn}.json`.replace(/^\//, '');
    }
    // console.log('Paths:', { tokenPath: this.tokenPath, credentialsPath: this.crendentialsPath });
  }

  // 초기화를 위한 별도 메서드
  async init({ user = 'bigwhitekmc', sn = 0 } = {}) {
    this.scopes = await getScopes({ user, sn, scopeDir: this.scopeDir });
    // console.log(`init SCOPES: ${this.scopes}`)

    // 스코프가 비어있는지 확인하고 기본값 설정
    if (!this.scopes || this.scopes.length === 0) {
      // console.log('Empty scopes after initialization, setting default scopes');
      this.scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ];
    }
    
    // console.log('Initialized scopes:', this.scopes);
    return this;
  }

  async loadSavedCredentialsIfExist() {
    try {
      // console.log('Loading credentials from:', this.tokenPath);
      const credentials: any = await loadJsonFromStorage(this.tokenPath);
      // console.log('Loaded credentials:', credentials ? '(exists)' : '(not found)');
      
      if (!credentials) {
        console.log('No credentials found');
        return null;
      }

      // console.log('Loading OAuth2 keys from:', this.crendentialsPath);
      const keys: any = await loadJsonFromStorage(this.crendentialsPath);
      
      if (!keys) {
        // console.log('No OAuth2 keys found');
        return null;
      }
      
      const key = keys.installed || keys.web;
      // console.log('OAuth2 key loaded:', key ? '(exists)' : '(not found)');

      if (!key || !key.client_id || !key.client_secret) {
        // console.log('Invalid OAuth2 keys');
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
          // console.log('Token refreshed successfully');
        } catch (refreshError: any) {
          // console.error('Error refreshing token:', refreshError);
          
          // 갱신 실패 시 토큰 파일 삭제 (invalid_grant 오류 처리)
          if (refreshError.message && typeof refreshError.message === 'string' && refreshError.message.includes('invalid_grant')) {
            // console.log('Invalid grant error detected. Removing token file and starting new authentication.');
            // saveJsonToStorage를 사용해 null 값을 저장하거나 빈 파일로 저장
            try {
              await saveJsonToStorage(this.tokenPath, {});
              console.log(`Token file cleared: ${this.tokenPath}`);
            } catch (removeError) {
              console.error('Failed to clear token file:', removeError);
            }
            return null;
          }
          
          if (!credentials.refresh_token) {
            console.log('No refresh token available, authentication required');
            return null;
          }
        }
      }

      return client;
    } catch (err) {
      // console.error('Error loading credentials:', err);
      return null;
    }
  }

  async saveCredentials(client: OAuth2Client) {
    try {
      // console.log('Saving credentials...');
      const keys: any = await loadJsonFromStorage(this.crendentialsPath);
      
      if (!keys) {
        // console.error('OAuth2 keys not found');
        throw new Error('OAuth2 keys not found');
      }
      
      const key = keys.installed || keys.web;
      
      if (!client.credentials.refresh_token) {
        // console.log('No refresh token in credentials, keeping existing one');
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
      
      // console.log('Saving credentials to:', this.tokenPath);
      await saveJsonToStorage(this.tokenPath, payload);
      // console.log('Credentials saved successfully');
    } catch (err) {
      // console.error('Error saving credentials:', err);
      throw err;
    }
  }

  async authorize() {
    // console.log('Starting authorization process...');
    
    // 스코프가 비어있는지 확인
    if (!this.scopes || this.scopes.length === 0) {
      // console.log('No scopes defined, initializing with default scopes');
      await this.init();
    }
    
    // console.log('Using scopes:', this.scopes);
    
    let client = await this.loadSavedCredentialsIfExist();
    
    if (client) {
      // 클라이언트 유효성 테스트 추가
      try {
        // 간단한 API 호출로 토큰이 실제로 유효한지 테스트
        const tokenInfo = await client.getTokenInfo(
          client.credentials.access_token || ''
        );
        // console.log('Token is valid:', tokenInfo?.scopes);
        return client;
      } catch (error: any) {
        console.error('Token validation failed:', error?.message || 'Unknown error');
        // console.log('Proceeding with new authentication...');
        // 유효성 검사 실패 시 계속 진행하여 새 인증 시작
      }
    } else {
      console.log('No valid credentials found, starting new authentication...');
    }
    
    // GitHub에서 OAuth2 키 파일 가져오기
    const keysContent = await loadJsonFromStorage(this.crendentialsPath);
    
    if (!keysContent) {
      throw new Error('OAuth2 키 파일을 GitHub에서 찾을 수 없습니다: ' + this.crendentialsPath);
    }
    
    // 임시 디렉토리 및 파일 생성
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'google-auth-'));
    const tempKeyFilePath = path.join(tempDir, 'oauth2-keys.json');
    
    try {
      // 내용을 임시 파일에 저장
      fs.writeFileSync(tempKeyFilePath, JSON.stringify(keysContent, null, 2));
      console.log('OAuth2 키 파일을 임시 위치에 저장했습니다:', tempKeyFilePath);
      
      // 임시 파일 경로로 인증
      console.log('Authenticating with scopes:', this.scopes);
      client = await authenticate({
        scopes: this.scopes,
        keyfilePath: tempKeyFilePath,
      });

      if (client.credentials) {
        console.log('New authentication successful, saving credentials...');
        await this.saveCredentials(client);
      }
      
      return client;
    } finally {
      // 인증 후 임시 파일 정리
      try {
        if (fs.existsSync(tempKeyFilePath)) {
          fs.unlinkSync(tempKeyFilePath);
        }
        fs.rmdirSync(tempDir);
        console.log('임시 파일 정리 완료');
      } catch (cleanupError) {
        console.warn('임시 파일 정리 중 오류 발생:', cleanupError);
      }
    }
  }
}