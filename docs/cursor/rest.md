```
아래는 google 인증을 위한 파일입니다. 
이 인증관련 함수들을 사용하여, 구글시트, 구글드라브 등을 사용하고 있어요.
예를 들어, 아래 코드처럼요.

그런데, google Keep이나 google Photo 처럼 REST api로 제공되는 서비스를 이용하려멸, 현재 google auth에 관련된 파일을 사용해서 OAuth2 인증처리를 하고, REST API 들을 사용할 수 있나요?

  service: any;
  googleAuth;
  spreadsheetId;

  // * CONSTRUCTOR
  /** GoogleAuth 참조(googleAuth.ts)
   */
  constructor(spreadsheetId: string, {user = "bigwhitekmc", type = "oauth2", sn = 0, scopeDir = 'Apis/google/spec/', authDir = 'Apis/google/' }: { user?: string; type?: string; sn?: number; scopeDir?: string; authDir?: string }) {
    this.googleAuth = new GoogleAuth({user, type, sn, scopeDir, authDir});
    this.spreadsheetId = spreadsheetId;
  }

  /** init
   */
  async init() {
    const auth = await this.googleAuth.authorize();
    this.service = google.sheets({ version: "v4", auth });
  }

```ts

```

```

---

네, 현재 사용하고 계신 GoogleAuth 클래스를 이용하여 Google Keep, Google Photos와 같은 REST API 서비스도 이용할 수 있습니다. 기존 OAuth2 인증 방식을 사용하여 이러한 서비스에 접근할 수 있습니다.

다만, 다음과 같은 조정이 필요합니다:

1. **스코프 확장**: 각 Google 서비스마다 필요한 스코프가 다릅니다. Google Keep이나 Photos에 접근하려면 해당 서비스의 스코프를 추가해야 합니다.

2. **서비스 객체 생성**: sheets API 대신 해당 서비스의 API 객체를 생성해야 합니다.

Google Keep과 Google Photos를 사용하는 예시 코드는 다음과 같습니다:

```typescript
// Google Photos 사용 예시
class GooglePhotosService {
  service: any;
  googleAuth;

  constructor({user = "bigwhitekmc", type = "oauth2", sn = 0, scopeDir = 'Apis/google/spec/', authDir = 'Apis/google/' }: { user?: string; type?: string; sn?: number; scopeDir?: string; authDir?: string }) {
    this.googleAuth = new GoogleAuth({user, type, sn, scopeDir, authDir});
  }

  async init() {
    // 사진 API를 위한 스코프가 scopes_[user]_[sn].json 파일에 포함되어 있어야 합니다
    // 예: "https://www.googleapis.com/auth/photoslibrary.readonly"
    // 또는 "https://www.googleapis.com/auth/photoslibrary"
    await this.googleAuth.init();
    const auth = await this.googleAuth.authorize();
    
    // Photos는 공식 Node.js 클라이언트 라이브러리가 없어서 REST API를 직접 호출해야 함
    this.service = {
      auth,
      makeRequest: async (endpoint: string, method = 'GET', body?: any) => {
        const url = `https://photoslibrary.googleapis.com/v1${endpoint}`;
        const headers = {
          Authorization: `Bearer ${auth.credentials.access_token}`,
          'Content-Type': 'application/json'
        };
        
        const options: RequestInit = {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined
        };
        
        const response = await fetch(url, options);
        return response.json();
      }
    };
  }

  async getAlbums() {
    return this.service.makeRequest('/albums');
  }

  async getPhotos(pageSize = 25) {
    return this.service.makeRequest('/mediaItems', 'POST', {
      pageSize
    });
  }
}

// Google Keep 사용 예시 (Keep API는 제한적으로 사용 가능)
class GoogleKeepService {
  service: any;
  googleAuth;

  constructor({user = "bigwhitekmc", type = "oauth2", sn = 0, scopeDir = 'Apis/google/spec/', authDir = 'Apis/google/' }: { user?: string; type?: string; sn?: number; scopeDir?: string; authDir?: string }) {
    this.googleAuth = new GoogleAuth({user, type, sn, scopeDir, authDir});
  }

  async init() {
    // Keep API를 위한 스코프가 필요합니다
    // "https://www.googleapis.com/auth/keep" 
    await this.googleAuth.init();
    const auth = await this.googleAuth.authorize();
    
    // Keep API 사용 준비
    this.service = {
      auth,
      makeRequest: async (endpoint: string, method = 'GET', body?: any) => {
        const url = `https://keep.googleapis.com/v1${endpoint}`;
        const headers = {
          Authorization: `Bearer ${auth.credentials.access_token}`,
          'Content-Type': 'application/json'
        };
        
        const options: RequestInit = {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined
        };
        
        const response = await fetch(url, options);
        return response.json();
      }
    };
  }

  async getNotes() {
    return this.service.makeRequest('/notes');
  }

  async createNote(title: string, content: string) {
    return this.service.makeRequest('/notes', 'POST', {
      title,
      textContent: content
    });
  }
}
```

주의사항:

1. **스코프 설정**: `scopes_[user]_[sn].json` 파일에 필요한 서비스의 스코프를 추가해야 합니다.
   - Google Photos: `https://www.googleapis.com/auth/photoslibrary` 또는 읽기 전용은 `https://www.googleapis.com/auth/photoslibrary.readonly`
   - Google Keep: `https://www.googleapis.com/auth/keep`

2. **API 제한**: Google Keep API는 Google Workspace 사용자를 위한 것으로, 일반 Gmail 계정에서는 제한될 수 있습니다.

3. **REST 호출**: 공식 Node.js 클라이언트 라이브러리가 없는 서비스는 위 예시처럼 직접 REST API를 호출해야 합니다.

기존의 GoogleAuth 클래스는 OAuth2 인증을 처리하는 부분만 담당하므로, 어떤 Google 서비스든 인증만 제대로 설정되면 API 호출이 가능합니다.