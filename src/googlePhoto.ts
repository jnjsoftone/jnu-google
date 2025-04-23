/** googlePhoto
 *
 * Description
 *   - A Class For Handling GooglePhoto
 *
 * Functions
 *   [X] Authentication for GooglePhoto
 *   [] listPhotos
 *
 * Usages
 *   -
 *
 * Requirements
 *   - npm install googleapis
 *   - ./googleAuth
 *
 * References
 *   - https://developers.google.com/gmail/api/quickstart/nodejs?hl=ko

 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */

// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules

// ? External Modules
import { google } from "googleapis";

// ? Local Modules
import { GoogleAuth } from "./googleAuth.js";

// & Class AREA
// &---------------------------------------------------------------------------
export class GooglePhoto {
  service: any;
  googleAuth;

  // * CONSTRUCTOR
  /** GoogleAuth 참조(googleAuth.ts)
   */
  constructor({user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = 'Apis/google/spec/', authDir = 'Apis/google/'} = {}) {
    this.googleAuth = new GoogleAuth({user, type, sn, scopeDir, authDir});
  }

  /** init
   */
  async init() {
    // 사진 API를 위한 스코프가 scopes_[user]_[sn].json 파일에 포함되어 있어야 합니다
    // 예: "https://www.googleapis.com/auth/photoslibrary"
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
