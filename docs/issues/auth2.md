## 인증 에러
- expired 후 자동 갱신 안됨


```prompt
@jnu-google 폴더에 있는 @googleAuth.ts 파일로 oath2 인증을 사용해서 googleSheets 등에 접근하고 있어요.

그런데, 처음 인증할 때는 잘 되는데, 사용만료(expired) 이후에 자동으로 token을 재발행하는 기능이 안되요
```



`googleAuth.ts` 파일을 보니 토큰 갱신 로직에 문제가 있네요. 현재 코드에서는 `refreshAccessToken` 함수가 있지만, 실제로는 Google OAuth2 클라이언트의 내장 토큰 갱신 기능을 사용하는 것이 더 안정적입니다.

다음과 같이 수정해보겠습니다:

```typescript:src/googleAuth.ts
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
```






주요 변경사항:

1. **타입 개선**:
   - `OAuth2Client` 타입을 명시적으로 import하고 사용
   - 클라이언트 객체에 대한 타입 지정 강화

2. **토큰 갱신 로직 개선**:
   ```typescript
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
   ```

3. **에러 처리 강화**:
   - 토큰 갱신 실패 시 새로운 인증을 시도하도록 변경
   - 에러 로깅 추가

4. **토큰 저장 개선**:
   - `refresh_token`을 저장하여 다음 갱신에 사용할 수 있도록 함
   - `expiry_date`도 함께 저장

이러한 변경으로:
1. 토큰이 만료되기 30초 전에 자동으로 갱신을 시도
2. 갱신 실패 시 새로운 인증을 진행
3. 토큰 정보를 더 안전하게 저장하고 관리

이제 토큰 만료 시 자동으로 갱신되어 인증이 끊기지 않을 것입니다.
