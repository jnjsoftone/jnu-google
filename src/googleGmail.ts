/** googleGmail
 *
 * Description
 *   - A Class For Handling GoogleGmail
 *
 * Functions
 *   [X] Authentication for GoogleGmail
 *   [] listGmails
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
 *   - https://developers.google.com/gmail/api/reference/rest?hl=ko
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
export class GoogleGmail {
  service: any;
  googleAuth;

  // * CONSTRUCTOR
  /** GoogleAuth 참조(googleAuth.ts)
   */
  constructor({user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = '', authDir = ''} = {}) {
    this.googleAuth = new GoogleAuth({user, type, sn, scopeDir, authDir});
  }

  /** init
   */
  async init() {
    const auth = await this.googleAuth.authorize();
    this.service = google.gmail({ version: "v1", auth });
  }

  /** listFiles
   *  list Files in google drive
   */
  listGmails = async () => {
    const service = await this.service;
  };
}

