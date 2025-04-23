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
export declare class GoogleGmail {
    service: any;
    googleAuth: any;
    /** GoogleAuth 참조(googleAuth.ts)
     */
    constructor({ user, type, sn, scopeDir, authDir }?: {
        user?: string | undefined;
        type?: string | undefined;
        sn?: number | undefined;
        scopeDir?: string | undefined;
        authDir?: string | undefined;
    });
    /** init
     * Gmail API 서비스를 초기화합니다.
     * Gmail API를 위한 스코프가 scopes_[user]_[sn].json 파일에 포함되어 있어야 합니다.
     * 예: "https://www.googleapis.com/auth/gmail.readonly" 또는 "https://www.googleapis.com/auth/gmail.modify"
     */
    init(): Promise<void>;
    /**
     * 사용자의 이메일 목록을 가져옵니다.
     * @param {Object} options - 검색 옵션
     * @param {string} options.q - 검색 쿼리 (선택사항)
     * @param {string} options.labelIds - 라벨 ID (선택사항)
     * @param {number} options.maxResults - 최대 결과 수 (선택사항)
     * @param {string} options.pageToken - 페이지네이션을 위한 토큰 (선택사항)
     * @returns {Promise<any>} 이메일 목록
     */
    listGmails(options?: {
        q?: string;
        labelIds?: string[];
        maxResults?: number;
        pageToken?: string;
    }): Promise<any>;
    /**
     * 특정 이메일의 상세 정보를 가져옵니다.
     * @param {string} messageId - 이메일 ID
     * @param {string} format - 응답 형식 (full, minimal, raw) (선택사항)
     * @returns {Promise<any>} 이메일 정보
     */
    getGmail(messageId: string, format?: 'full' | 'minimal' | 'raw'): Promise<any>;
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
    sendGmail(options: {
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
    }): Promise<any>;
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
    createDraft(options: {
        to: string;
        subject: string;
        text: string;
        html?: string;
        from?: string;
        cc?: string[];
        bcc?: string[];
    }): Promise<any>;
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
    updateDraft(draftId: string, options: {
        to: string;
        subject: string;
        text: string;
        html?: string;
        from?: string;
        cc?: string[];
        bcc?: string[];
    }): Promise<any>;
    /**
     * 이메일 초안을 삭제합니다.
     * @param {string} draftId - 초안 ID
     * @returns {Promise<any>} 초안 삭제 결과
     */
    deleteDraft(draftId: string): Promise<any>;
    /**
     * 사용자의 이메일 초안 목록을 가져옵니다.
     * @param {number} maxResults - 최대 결과 수 (선택사항)
     * @param {string} pageToken - 페이지네이션을 위한 토큰 (선택사항)
     * @returns {Promise<any>} 초안 목록
     */
    listDrafts(maxResults?: number, pageToken?: string): Promise<any>;
    /**
     * 특정 이메일 초안의 상세 정보를 가져옵니다.
     * @param {string} draftId - 초안 ID
     * @param {string} format - 응답 형식 (full, minimal, raw) (선택사항)
     * @returns {Promise<any>} 초안 정보
     */
    getDraft(draftId: string, format?: 'full' | 'minimal' | 'raw'): Promise<any>;
    /**
     * 사용자의 라벨 목록을 가져옵니다.
     * @returns {Promise<any>} 라벨 목록
     */
    listLabels(): Promise<any>;
    /**
     * 새로운 라벨을 생성합니다.
     * @param {Object} label - 라벨 정보
     * @param {string} label.name - 라벨 이름
     * @param {string} label.labelListVisibility - 라벨 목록 표시 여부 (labelShow, labelShowIfUnread, labelHide)
     * @param {string} label.messageListVisibility - 메시지 목록 표시 여부 (show, hide)
     * @param {string} label.type - 라벨 타입 (system, user)
     * @returns {Promise<any>} 라벨 생성 결과
     */
    createLabel(label: {
        name: string;
        labelListVisibility: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
        messageListVisibility: 'show' | 'hide';
        type: 'system' | 'user';
    }): Promise<any>;
    /**
     * 라벨을 업데이트합니다.
     * @param {string} labelId - 라벨 ID
     * @param {Object} label - 라벨 정보
     * @param {string} label.name - 라벨 이름
     * @param {string} label.labelListVisibility - 라벨 목록 표시 여부 (labelShow, labelShowIfUnread, labelHide)
     * @param {string} label.messageListVisibility - 메시지 목록 표시 여부 (show, hide)
     * @returns {Promise<any>} 라벨 업데이트 결과
     */
    updateLabel(labelId: string, label: {
        name?: string;
        labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
        messageListVisibility?: 'show' | 'hide';
    }): Promise<any>;
    /**
     * 라벨을 삭제합니다.
     * @param {string} labelId - 라벨 ID
     * @returns {Promise<any>} 라벨 삭제 결과
     */
    deleteLabel(labelId: string): Promise<any>;
    /**
     * 사용자의 이메일 스레드 목록을 가져옵니다.
     * @param {Object} options - 검색 옵션
     * @param {string} options.q - 검색 쿼리 (선택사항)
     * @param {string} options.labelIds - 라벨 ID (선택사항)
     * @param {number} options.maxResults - 최대 결과 수 (선택사항)
     * @param {string} options.pageToken - 페이지네이션을 위한 토큰 (선택사항)
     * @returns {Promise<any>} 스레드 목록
     */
    listThreads(options?: {
        q?: string;
        labelIds?: string[];
        maxResults?: number;
        pageToken?: string;
    }): Promise<any>;
    /**
     * 특정 이메일 스레드의 상세 정보를 가져옵니다.
     * @param {string} threadId - 스레드 ID
     * @param {string} format - 응답 형식 (full, minimal, raw) (선택사항)
     * @returns {Promise<any>} 스레드 정보
     */
    getThread(threadId: string, format?: 'full' | 'minimal' | 'raw'): Promise<any>;
    /**
     * 이메일 스레드를 수정합니다.
     * @param {string} threadId - 스레드 ID
     * @param {Object} options - 수정 옵션
     * @param {string[]} options.addLabelIds - 추가할 라벨 ID 배열
     * @param {string[]} options.removeLabelIds - 제거할 라벨 ID 배열
     * @returns {Promise<any>} 스레드 수정 결과
     */
    modifyThread(threadId: string, options: {
        addLabelIds?: string[];
        removeLabelIds?: string[];
    }): Promise<any>;
    /**
     * 이메일 스레드를 휴지통으로 이동합니다.
     * @param {string} threadId - 스레드 ID
     * @returns {Promise<any>} 스레드 이동 결과
     */
    trashThread(threadId: string): Promise<any>;
    /**
     * 휴지통에서 이메일 스레드를 복원합니다.
     * @param {string} threadId - 스레드 ID
     * @returns {Promise<any>} 스레드 복원 결과
     */
    untrashThread(threadId: string): Promise<any>;
    /**
     * 이메일 스레드를 삭제합니다.
     * @param {string} threadId - 스레드 ID
     * @returns {Promise<any>} 스레드 삭제 결과
     */
    deleteThread(threadId: string): Promise<any>;
}
//# sourceMappingURL=googleGmail.d.ts.map