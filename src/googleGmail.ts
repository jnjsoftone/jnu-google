/** googleGmail
 *
 * Description
 *   - A Class For Handling GoogleGmail
 *
 * Functions
 *   [X] Authentication for GoogleGmail
 *   [X] listGmails
 *   [X] getGmail
 *   [X] sendGmail
 *   [X] createDraft
 *   [X] updateDraft
 *   [X] deleteDraft
 *   [X] listDrafts
 *   [X] getDraft
 *   [X] listLabels
 *   [X] createLabel
 *   [X] updateLabel
 *   [X] deleteLabel
 *   [X] listThreads
 *   [X] getThread
 *   [X] modifyThread
 *   [X] trashThread
 *   [X] untrashThread
 *   [X] deleteThread
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
  constructor({user = 'bigwhitekmc', type = 'oauth2', sn = 0, scopeDir = 'Apis/google/spec/', authDir = 'Apis/google/'} = {}) {
    this.googleAuth = new GoogleAuth({user, type, sn, scopeDir, authDir});
  }

  /** init
   * Gmail API 서비스를 초기화합니다.
   * Gmail API를 위한 스코프가 scopes_[user]_[sn].json 파일에 포함되어 있어야 합니다.
   * 예: "https://www.googleapis.com/auth/gmail.readonly" 또는 "https://www.googleapis.com/auth/gmail.modify"
   */
  async init() {
    await this.googleAuth.init();
    const auth = await this.googleAuth.authorize();
    this.service = google.gmail({ version: "v1", auth });
  }

  /**
   * 사용자의 이메일 목록을 가져옵니다.
   * @param {Object} options - 검색 옵션
   * @param {string} options.q - 검색 쿼리 (선택사항)
   * @param {string} options.labelIds - 라벨 ID (선택사항)
   * @param {number} options.maxResults - 최대 결과 수 (선택사항)
   * @param {string} options.pageToken - 페이지네이션을 위한 토큰 (선택사항)
   * @returns {Promise<any>} 이메일 목록
   */
  async listGmails(options: {
    q?: string;
    labelIds?: string[];
    maxResults?: number;
    pageToken?: string;
  } = {}) {
    const { q, labelIds, maxResults, pageToken } = options;
    const params: any = {};
    
    if (q) params.q = q;
    if (labelIds) params.labelIds = labelIds;
    if (maxResults) params.maxResults = maxResults;
    if (pageToken) params.pageToken = pageToken;
    
    return this.service.users.messages.list({
      userId: 'me',
      ...params
    });
  }

  /**
   * 특정 이메일의 상세 정보를 가져옵니다.
   * @param {string} messageId - 이메일 ID
   * @param {string} format - 응답 형식 (full, minimal, raw) (선택사항)
   * @returns {Promise<any>} 이메일 정보
   */
  async getGmail(messageId: string, format: 'full' | 'minimal' | 'raw' = 'full') {
    return this.service.users.messages.get({
      userId: 'me',
      id: messageId,
      format
    });
  }

  /**
   * 이메일을 보냅니다.
   * @param {Object} options - 이메일 옵션
   * @param {string} options.to - 수신자 이메일 주소
   * @param {string} options.subject - 이메일 제목
   * @param {string} options.text - 이메일 내용 (텍스트)
   * @param {string} options.html - 이메일 내용 (HTML) (선택사항)
   * @param {string} options.from - 발신자 이메일 주소 (선택사항)
   * @param {string[]} options.cc - 참조 이메일 주소 (선택사항)
   * @param {string[]} options.bcc - 숨은 참조 이메일 주소 (선택사항)
   * @param {Object[]} options.attachments - 첨부 파일 (선택사항)
   * @returns {Promise<any>} 전송 결과
   */
  async sendGmail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    from?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: Array<{
      filename: string;
      content: string;
      contentType: string;
    }>;
  }) {
    const { to, subject, text, html, from, cc, bcc, attachments } = options;
    
    // 이메일 헤더 구성
    const headers = [
      `From: ${from || 'me'}`,
      `To: ${to}`,
      `Subject: ${subject}`
    ];
    
    if (cc && cc.length > 0) {
      headers.push(`Cc: ${cc.join(', ')}`);
    }
    
    // 이메일 본문 구성
    let emailContent = headers.join('\r\n') + '\r\n\r\n';
    
    if (html) {
      // 멀티파트 이메일 구성
      const boundary = `boundary_${Date.now()}`;
      emailContent = `MIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=${boundary}\r\n\r\n`;
      emailContent += `--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${text}\r\n\r\n`;
      emailContent += `--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${html}\r\n\r\n`;
      emailContent += `--${boundary}--`;
    } else {
      emailContent += text;
    }
    
    // 첨부 파일이 있는 경우 멀티파트 이메일 구성
    if (attachments && attachments.length > 0) {
      const boundary = `boundary_${Date.now()}`;
      let multipartContent = `MIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=${boundary}\r\n\r\n`;
      
      // 이메일 본문 추가
      multipartContent += `--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${text}\r\n\r\n`;
      
      // 첨부 파일 추가
      for (const attachment of attachments) {
        multipartContent += `--${boundary}\r\nContent-Type: ${attachment.contentType}; name="${attachment.filename}"\r\n`;
        multipartContent += `Content-Disposition: attachment; filename="${attachment.filename}"\r\n`;
        multipartContent += `Content-Transfer-Encoding: base64\r\n\r\n`;
        multipartContent += `${attachment.content}\r\n\r\n`;
      }
      
      multipartContent += `--${boundary}--`;
      emailContent = multipartContent;
    }
    
    // Base64 인코딩
    const encodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    return this.service.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail
      }
    });
  }

  /**
   * 이메일 초안을 생성합니다.
   * @param {Object} options - 이메일 옵션
   * @param {string} options.to - 수신자 이메일 주소
   * @param {string} options.subject - 이메일 제목
   * @param {string} options.text - 이메일 내용 (텍스트)
   * @param {string} options.html - 이메일 내용 (HTML) (선택사항)
   * @param {string} options.from - 발신자 이메일 주소 (선택사항)
   * @param {string[]} options.cc - 참조 이메일 주소 (선택사항)
   * @param {string[]} options.bcc - 숨은 참조 이메일 주소 (선택사항)
   * @returns {Promise<any>} 초안 생성 결과
   */
  async createDraft(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    from?: string;
    cc?: string[];
    bcc?: string[];
  }) {
    const { to, subject, text, html, from, cc, bcc } = options;
    
    // 이메일 헤더 구성
    const headers = [
      `From: ${from || 'me'}`,
      `To: ${to}`,
      `Subject: ${subject}`
    ];
    
    if (cc && cc.length > 0) {
      headers.push(`Cc: ${cc.join(', ')}`);
    }
    
    // 이메일 본문 구성
    let emailContent = headers.join('\r\n') + '\r\n\r\n';
    
    if (html) {
      // 멀티파트 이메일 구성
      const boundary = `boundary_${Date.now()}`;
      emailContent = `MIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=${boundary}\r\n\r\n`;
      emailContent += `--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${text}\r\n\r\n`;
      emailContent += `--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${html}\r\n\r\n`;
      emailContent += `--${boundary}--`;
    } else {
      emailContent += text;
    }
    
    // Base64 인코딩
    const encodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    return this.service.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedEmail
        }
      }
    });
  }

  /**
   * 이메일 초안을 업데이트합니다.
   * @param {string} draftId - 초안 ID
   * @param {Object} options - 이메일 옵션
   * @param {string} options.to - 수신자 이메일 주소
   * @param {string} options.subject - 이메일 제목
   * @param {string} options.text - 이메일 내용 (텍스트)
   * @param {string} options.html - 이메일 내용 (HTML) (선택사항)
   * @param {string} options.from - 발신자 이메일 주소 (선택사항)
   * @param {string[]} options.cc - 참조 이메일 주소 (선택사항)
   * @param {string[]} options.bcc - 숨은 참조 이메일 주소 (선택사항)
   * @returns {Promise<any>} 초안 업데이트 결과
   */
  async updateDraft(draftId: string, options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    from?: string;
    cc?: string[];
    bcc?: string[];
  }) {
    const { to, subject, text, html, from, cc, bcc } = options;
    
    // 이메일 헤더 구성
    const headers = [
      `From: ${from || 'me'}`,
      `To: ${to}`,
      `Subject: ${subject}`
    ];
    
    if (cc && cc.length > 0) {
      headers.push(`Cc: ${cc.join(', ')}`);
    }
    
    // 이메일 본문 구성
    let emailContent = headers.join('\r\n') + '\r\n\r\n';
    
    if (html) {
      // 멀티파트 이메일 구성
      const boundary = `boundary_${Date.now()}`;
      emailContent = `MIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=${boundary}\r\n\r\n`;
      emailContent += `--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${text}\r\n\r\n`;
      emailContent += `--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${html}\r\n\r\n`;
      emailContent += `--${boundary}--`;
    } else {
      emailContent += text;
    }
    
    // Base64 인코딩
    const encodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    return this.service.users.drafts.update({
      userId: 'me',
      id: draftId,
      requestBody: {
        message: {
          raw: encodedEmail
        }
      }
    });
  }

  /**
   * 이메일 초안을 삭제합니다.
   * @param {string} draftId - 초안 ID
   * @returns {Promise<any>} 초안 삭제 결과
   */
  async deleteDraft(draftId: string) {
    return this.service.users.drafts.delete({
      userId: 'me',
      id: draftId
    });
  }

  /**
   * 사용자의 이메일 초안 목록을 가져옵니다.
   * @param {number} maxResults - 최대 결과 수 (선택사항)
   * @param {string} pageToken - 페이지네이션을 위한 토큰 (선택사항)
   * @returns {Promise<any>} 초안 목록
   */
  async listDrafts(maxResults?: number, pageToken?: string) {
    const params: any = {};
    
    if (maxResults) params.maxResults = maxResults;
    if (pageToken) params.pageToken = pageToken;
    
    return this.service.users.drafts.list({
      userId: 'me',
      ...params
    });
  }

  /**
   * 특정 이메일 초안의 상세 정보를 가져옵니다.
   * @param {string} draftId - 초안 ID
   * @param {string} format - 응답 형식 (full, minimal, raw) (선택사항)
   * @returns {Promise<any>} 초안 정보
   */
  async getDraft(draftId: string, format: 'full' | 'minimal' | 'raw' = 'full') {
    return this.service.users.drafts.get({
      userId: 'me',
      id: draftId,
      format
    });
  }

  /**
   * 사용자의 라벨 목록을 가져옵니다.
   * @returns {Promise<any>} 라벨 목록
   */
  async listLabels() {
    return this.service.users.labels.list({
      userId: 'me'
    });
  }

  /**
   * 새로운 라벨을 생성합니다.
   * @param {Object} label - 라벨 정보
   * @param {string} label.name - 라벨 이름
   * @param {string} label.labelListVisibility - 라벨 목록 표시 여부 (labelShow, labelShowIfUnread, labelHide)
   * @param {string} label.messageListVisibility - 메시지 목록 표시 여부 (show, hide)
   * @param {string} label.type - 라벨 타입 (system, user)
   * @returns {Promise<any>} 라벨 생성 결과
   */
  async createLabel(label: {
    name: string;
    labelListVisibility: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
    messageListVisibility: 'show' | 'hide';
    type: 'system' | 'user';
  }) {
    return this.service.users.labels.create({
      userId: 'me',
      requestBody: label
    });
  }

  /**
   * 라벨을 업데이트합니다.
   * @param {string} labelId - 라벨 ID
   * @param {Object} label - 라벨 정보
   * @param {string} label.name - 라벨 이름
   * @param {string} label.labelListVisibility - 라벨 목록 표시 여부 (labelShow, labelShowIfUnread, labelHide)
   * @param {string} label.messageListVisibility - 메시지 목록 표시 여부 (show, hide)
   * @returns {Promise<any>} 라벨 업데이트 결과
   */
  async updateLabel(labelId: string, label: {
    name?: string;
    labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
    messageListVisibility?: 'show' | 'hide';
  }) {
    return this.service.users.labels.patch({
      userId: 'me',
      id: labelId,
      requestBody: label
    });
  }

  /**
   * 라벨을 삭제합니다.
   * @param {string} labelId - 라벨 ID
   * @returns {Promise<any>} 라벨 삭제 결과
   */
  async deleteLabel(labelId: string) {
    return this.service.users.labels.delete({
      userId: 'me',
      id: labelId
    });
  }

  /**
   * 사용자의 이메일 스레드 목록을 가져옵니다.
   * @param {Object} options - 검색 옵션
   * @param {string} options.q - 검색 쿼리 (선택사항)
   * @param {string} options.labelIds - 라벨 ID (선택사항)
   * @param {number} options.maxResults - 최대 결과 수 (선택사항)
   * @param {string} options.pageToken - 페이지네이션을 위한 토큰 (선택사항)
   * @returns {Promise<any>} 스레드 목록
   */
  async listThreads(options: {
    q?: string;
    labelIds?: string[];
    maxResults?: number;
    pageToken?: string;
  } = {}) {
    const { q, labelIds, maxResults, pageToken } = options;
    const params: any = {};
    
    if (q) params.q = q;
    if (labelIds) params.labelIds = labelIds;
    if (maxResults) params.maxResults = maxResults;
    if (pageToken) params.pageToken = pageToken;
    
    return this.service.users.threads.list({
      userId: 'me',
      ...params
    });
  }

  /**
   * 특정 이메일 스레드의 상세 정보를 가져옵니다.
   * @param {string} threadId - 스레드 ID
   * @param {string} format - 응답 형식 (full, minimal, raw) (선택사항)
   * @returns {Promise<any>} 스레드 정보
   */
  async getThread(threadId: string, format: 'full' | 'minimal' | 'raw' = 'full') {
    return this.service.users.threads.get({
      userId: 'me',
      id: threadId,
      format
    });
  }

  /**
   * 이메일 스레드를 수정합니다.
   * @param {string} threadId - 스레드 ID
   * @param {Object} options - 수정 옵션
   * @param {string[]} options.addLabelIds - 추가할 라벨 ID 배열
   * @param {string[]} options.removeLabelIds - 제거할 라벨 ID 배열
   * @returns {Promise<any>} 스레드 수정 결과
   */
  async modifyThread(threadId: string, options: {
    addLabelIds?: string[];
    removeLabelIds?: string[];
  }) {
    return this.service.users.threads.modify({
      userId: 'me',
      id: threadId,
      requestBody: options
    });
  }

  /**
   * 이메일 스레드를 휴지통으로 이동합니다.
   * @param {string} threadId - 스레드 ID
   * @returns {Promise<any>} 스레드 이동 결과
   */
  async trashThread(threadId: string) {
    return this.service.users.threads.trash({
      userId: 'me',
      id: threadId
    });
  }

  /**
   * 휴지통에서 이메일 스레드를 복원합니다.
   * @param {string} threadId - 스레드 ID
   * @returns {Promise<any>} 스레드 복원 결과
   */
  async untrashThread(threadId: string) {
    return this.service.users.threads.untrash({
      userId: 'me',
      id: threadId
    });
  }

  /**
   * 이메일 스레드를 삭제합니다.
   * @param {string} threadId - 스레드 ID
   * @returns {Promise<any>} 스레드 삭제 결과
   */
  async deleteThread(threadId: string) {
    return this.service.users.threads.delete({
      userId: 'me',
      id: threadId
    });
  }
}

