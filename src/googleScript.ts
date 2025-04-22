/** googleScript
 *
 * Description
 *   - A Class For GAS(Google Apps Script)
 *
 * Functions
 *   [X] run GAS
 *   [X] create project
 *   [X] add file
 *
 * Usages
 *   -
 *
 * Requirements
 *   - npm install googleapis @google-cloud/local-auth --saves
 *   - 프로젝트 설정
 *     - 프로젝트 설정 > GCP
 *     - GCP 프로젝트 번호: 579*********
 *   - 배포
 *     - 배포 > 새배포 > 유형 > API 실행 파일
 *
 * References
 *   - https://developers.google.com/apps-script/api/reference/rest?hl=ko
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

// ? UserMade Modules
// ? Local Modules
import { GoogleAuth } from "./googleAuth.js";
// import { AnyAaaaRecord } from "dns";

// & Function AREA
// &---------------------------------------------------------------------------
export class GoogleScript {
  auth: any;
  service: any;
  googleAuth;

  // * CONSTRUCTOR
  /** GoogleAuth 참조(googleAuth.ts)
   */
  constructor({user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = 'Apis/google/spec', authDir = 'Apis/google'} = {}) {
    this.googleAuth = new GoogleAuth({user, type, sn, scopeDir, authDir});
    this.auth = this.googleAuth.authorize();
  }

  /** init
   */
  async init() {
    const auth = await this.googleAuth.authorize();
    this.service = google.script({ version: "v1", auth });
  }

  runScript = async (scriptId: string) => {
    let res = await this.service.scripts.run({
      auth: this.auth,
      requestBody: {
        function: "writeToSheet",
      },
      scriptId: scriptId,
    });
  };

  createScript = async (title: string, description?: string) => {
    let response = await this.service.projects.create({
      requestBody: {
        title: "ScriptByTypeScript",
      },
    });

    await this.service.projects.updateContent({
      auth: this.auth,
      scriptId: response.data.scriptId!,
      requestBody: {
        files: [
          {
            name: "hello",
            type: "SERVER_JS",
            source: 'function helloWorld() {\n  console.log("Hello, world!");\n}',
          },
          {
            // * 필수 파일
            name: "appsscript",
            type: "JSON",
            source: '{"timeZone":"Asia/Seoul","exceptionLogging":' + '"CLOUD"}',
          },
          {
            name: "README",
            type: "HTML",
            source: "<HTML><BODY>readme!</BODY></HTML>",
          },
        ],
      },
    });
  };

  addFile = async (scriptId: string, name: string, type: string, source: string) => {
    await this.service.projects.updateContent({
      auth: this.auth,
      scriptId: scriptId,
      requestBody: {
        files: [
          {
            name: name,
            type: type, // "SERVER_JS", "HTML" / "JSON"
            source: source,
          },
        ],
      },
    });
  };

  addFiles = async (scriptId: string, files: any[]) => {
    await this.service.projects.updateContent({
      auth: this.auth,
      scriptId: scriptId,
      requestBody: {
        files: files,
      },
    });
  };
}
