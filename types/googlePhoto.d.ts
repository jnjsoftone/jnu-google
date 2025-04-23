/** googlePhoto
 *
 * Description
 *   - A Class For Handling GooglePhoto
 *
 * Functions
 *   [X] Authentication for GooglePhoto
 *   [X] listPhotos
 *   [X] getAlbums
 *   [X] getAlbum
 *   [X] createAlbum
 *   [X] addMediaItemsToAlbum
 *   [X] removeMediaItemsFromAlbum
 *   [X] getMediaItems
 *   [X] getMediaItem
 *   [X] searchMediaItems
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
 *   - https://developers.google.com/photos/library/reference/rest?hl=ko
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
export declare class GooglePhoto {
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
     * Google Photos API 서비스를 초기화합니다.
     * 사진 API를 위한 스코프가 scopes_[user]_[sn].json 파일에 포함되어 있어야 합니다.
     * 예: "https://www.googleapis.com/auth/photoslibrary"
     */
    init(): Promise<void>;
    /**
     * 사용자의 모든 앨범 목록을 가져옵니다.
     * @param {number} pageSize - 한 페이지에 반환할 앨범 수 (최대 50)
     * @param {string} pageToken - 페이지네이션을 위한 토큰
     * @returns {Promise<any>} 앨범 목록
     */
    getAlbums(pageSize?: number, pageToken?: string): Promise<any>;
    /**
     * 특정 앨범의 상세 정보를 가져옵니다.
     * @param {string} albumId - 앨범 ID
     * @returns {Promise<any>} 앨범 정보
     */
    getAlbum(albumId: string): Promise<any>;
    /**
     * 새로운 앨범을 생성합니다.
     * @param {string} title - 앨범 제목
     * @param {string} coverPhotoBaseUrl - 커버 사진 URL (선택사항)
     * @returns {Promise<any>} 생성된 앨범 정보
     */
    createAlbum(title: string, coverPhotoBaseUrl?: string): Promise<any>;
    /**
     * 앨범에 미디어 항목을 추가합니다.
     * @param {string} albumId - 앨범 ID
     * @param {string[]} mediaItemIds - 추가할 미디어 항목 ID 배열
     * @returns {Promise<any>} 작업 결과
     */
    addMediaItemsToAlbum(albumId: string, mediaItemIds: string[]): Promise<any>;
    /**
     * 앨범에서 미디어 항목을 제거합니다.
     * @param {string} albumId - 앨범 ID
     * @param {string[]} mediaItemIds - 제거할 미디어 항목 ID 배열
     * @returns {Promise<any>} 작업 결과
     */
    removeMediaItemsFromAlbum(albumId: string, mediaItemIds: string[]): Promise<any>;
    /**
     * 사용자의 미디어 항목 목록을 가져옵니다.
     * @param {number} pageSize - 한 페이지에 반환할 항목 수 (최대 100)
     * @param {string} pageToken - 페이지네이션을 위한 토큰
     * @returns {Promise<any>} 미디어 항목 목록
     */
    getMediaItems(pageSize?: number, pageToken?: string): Promise<any>;
    /**
     * 특정 미디어 항목의 상세 정보를 가져옵니다.
     * @param {string} mediaItemId - 미디어 항목 ID
     * @returns {Promise<any>} 미디어 항목 정보
     */
    getMediaItem(mediaItemId: string): Promise<any>;
    /**
     * 미디어 항목을 검색합니다.
     * @param {Object} options - 검색 옵션
     * @param {string[]} options.albumIds - 검색할 앨범 ID 배열 (선택사항)
     * @param {string[]} options.mediaTypes - 검색할 미디어 타입 배열 (선택사항)
     * @param {string} options.orderBy - 정렬 기준 (선택사항)
     * @param {number} options.pageSize - 한 페이지에 반환할 항목 수 (최대 100)
     * @param {string} options.pageToken - 페이지네이션을 위한 토큰 (선택사항)
     * @returns {Promise<any>} 검색 결과
     */
    searchMediaItems(options?: {
        albumIds?: string[];
        mediaTypes?: string[];
        orderBy?: string;
        pageSize?: number;
        pageToken?: string;
    }): Promise<any>;
    /**
     * 미디어 항목을 업로드합니다.
     * @param {string} fileName - 파일 이름
     * @param {string} mimeType - MIME 타입
     * @param {string} uploadToken - 업로드 토큰
     * @returns {Promise<any>} 업로드 결과
     */
    uploadMediaItem(fileName: string, mimeType: string, uploadToken: string): Promise<any>;
    /**
     * 미디어 항목을 삭제합니다.
     * @param {string} mediaItemId - 삭제할 미디어 항목 ID
     * @returns {Promise<any>} 삭제 결과
     */
    deleteMediaItem(mediaItemId: string): Promise<any>;
    /**
     * 앨범을 삭제합니다.
     * @param {string} albumId - 삭제할 앨범 ID
     * @returns {Promise<any>} 삭제 결과
     */
    deleteAlbum(albumId: string): Promise<any>;
    /**
     * 앨범 정보를 업데이트합니다.
     * @param {string} albumId - 업데이트할 앨범 ID
     * @param {Object} album - 업데이트할 앨범 정보
     * @param {string} album.title - 앨범 제목 (선택사항)
     * @param {string} album.coverPhotoBaseUrl - 커버 사진 URL (선택사항)
     * @returns {Promise<any>} 업데이트 결과
     */
    updateAlbum(albumId: string, album: {
        title?: string;
        coverPhotoBaseUrl?: string;
    }): Promise<any>;
}
//# sourceMappingURL=googlePhoto.d.ts.map