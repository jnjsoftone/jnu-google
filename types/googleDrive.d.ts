/** googleDrive
 *
 * Description
 *   - A Class For Handling GoogleDrive
 *
 * Functions
 *   [X] Authentication for GoogleSheet
 *   [X] listFiles - 파일 목록 조회
 *   [X] createFile - 파일 생성
 *   [X] getFile - 파일 정보 조회
 *   [X] updateFile - 파일 업데이트
 *   [X] deleteFile - 파일 삭제
 *   [X] downloadFile - 파일 다운로드
 *   [X] uploadFile - 파일 업로드
 *   [X] createFolder - 폴더 생성
 *   [X] searchFiles - 파일 검색
 *   [X] copyFile - 파일 복사
 *   [X] moveFile - 파일 이동
 *   [X] getFilePermissions - 파일 권한 조회
 *   [X] shareFile - 파일 공유 설정
 *   [X] revokePermission - 권한 취소
 *
 * Usages
 *   -
 *
 * Requirements
 *   - npm install googleapis
 *   - ./googleAuth
 *
 * References
 *   - https://developers.google.com/workspace/drive?hl=ko
 *   - https://developers.google.com/drive/api/quickstart/nodejs?hl=ko
 *   - https://developers.google.com/drive/api/reference/rest?hl=ko
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
export interface DriveFile {
    id?: string;
    name?: string;
    mimeType?: string;
    description?: string;
    parents?: string[];
    [key: string]: any;
}
export interface Permission {
    id?: string;
    type?: 'user' | 'group' | 'domain' | 'anyone';
    role?: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
    emailAddress?: string;
    domain?: string;
    allowFileDiscovery?: boolean;
    [key: string]: any;
}
export interface SearchOptions {
    pageSize?: number;
    orderBy?: string;
    fields?: string;
    q?: string;
    pageToken?: string;
}
export declare class GoogleDrive {
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
     */
    init(): Promise<this>;
    /** listFiles
     *  list Files in google drive
     * @param options - 파일 목록 조회 옵션
     * @returns 파일 목록
     */
    listFiles: (options?: SearchOptions) => Promise<never[] | {
        files: any;
        nextPageToken: any;
    }>;
    /** searchFiles
     * 파일 검색
     * @param query - 검색 쿼리 (예: "name contains 'test'")
     * @param options - 추가 검색 옵션
     * @returns 검색된 파일 목록
     */
    searchFiles: (query: string, options?: SearchOptions) => Promise<never[] | {
        files: any;
        nextPageToken: any;
    }>;
    /** getFile
     * 파일 정보 조회
     * @param fileId - 파일 ID
     * @param fields - 조회할 필드
     * @returns 파일 정보
     */
    getFile: (fileId: string, fields?: string) => Promise<any>;
    /** createFile
     * 파일 생성 (메타데이터만 생성)
     * @param fileMetadata - 생성할 파일 메타데이터
     * @returns 생성된 파일 정보
     */
    createFile: (fileMetadata: DriveFile) => Promise<any>;
    /** createFolder
     * 폴더 생성
     * @param folderName - 폴더 이름
     * @param parentId - 상위 폴더 ID (없으면 루트 폴더에 생성)
     * @returns 생성된 폴더 정보
     */
    createFolder: (folderName: string, parentId?: string) => Promise<any>;
    /** uploadFile
     * 파일 업로드
     * @param filePath - 업로드할 로컬 파일 경로
     * @param options - 업로드 옵션 (이름, 설명, 부모 폴더 등)
     * @returns 업로드된 파일 정보
     */
    uploadFile: (filePath: string, options?: {
        name?: string;
        description?: string;
        parentId?: string;
        mimeType?: string;
    }) => Promise<any>;
    /** updateFile
     * 파일 메타데이터 업데이트
     * @param fileId - 파일 ID
     * @param fileMetadata - 업데이트할 메타데이터
     * @returns 업데이트된 파일 정보
     */
    updateFile: (fileId: string, fileMetadata: DriveFile) => Promise<any>;
    /** updateFileContent
     * 파일 콘텐츠 업데이트
     * @param fileId - 파일 ID
     * @param filePath - 업데이트할 로컬 파일 경로
     * @param mimeType - 파일 MIME 타입
     * @returns 업데이트된 파일 정보
     */
    updateFileContent: (fileId: string, filePath: string, mimeType?: string) => Promise<any>;
    /** deleteFile
     * 파일 삭제
     * @param fileId - 삭제할 파일 ID
     * @returns 삭제 성공 여부
     */
    deleteFile: (fileId: string) => Promise<boolean>;
    /** downloadFile
     * 파일 다운로드
     * @param fileId - 다운로드할 파일 ID
     * @param destPath - 저장할 로컬 경로
     * @returns 다운로드 결과
     */
    downloadFile: (fileId: string, destPath: string) => Promise<unknown>;
    /** copyFile
     * 파일 복사
     * @param fileId - 복사할 파일 ID
     * @param options - 복사 옵션 (이름, 설명, 부모 폴더 등)
     * @returns 복사된 파일 정보
     */
    copyFile: (fileId: string, options?: {
        name?: string;
        description?: string;
        parentId?: string;
    }) => Promise<any>;
    /** moveFile
     * 파일 이동 (부모 폴더 변경)
     * @param fileId - 이동할 파일 ID
     * @param newParentId - 새 부모 폴더 ID
     * @param removeParents - 제거할 부모 폴더 ID (지정하지 않으면 자동으로 현재 부모 폴더 제거)
     * @returns 이동된 파일 정보
     */
    moveFile: (fileId: string, newParentId: string, removeParents?: string) => Promise<any>;
    /** getFilePermissions
     * 파일 권한 조회
     * @param fileId - 파일 ID
     * @returns 권한 목록
     */
    getFilePermissions: (fileId: string) => Promise<any>;
    /** shareFile
     * 파일 공유 설정
     * @param fileId - 공유할 파일 ID
     * @param permission - 권한 설정
     * @param sendNotification - 알림 이메일 발송 여부
     * @returns 생성된 권한 정보
     */
    shareFile: (fileId: string, permission: Permission, sendNotification?: boolean) => Promise<any>;
    /** revokePermission
     * 파일 권한 취소
     * @param fileId - 파일 ID
     * @param permissionId - 취소할 권한 ID
     * @returns 취소 성공 여부
     */
    revokePermission: (fileId: string, permissionId: string) => Promise<boolean>;
    /** generatePublicUrl
     * 파일의 공개 URL 생성
     * @param fileId - 파일 ID
     * @param publish - 공개 여부 (true: 공개, false: 비공개)
     * @returns 파일 URL 정보
     */
    generatePublicUrl: (fileId: string, publish?: boolean) => Promise<{
        webViewLink: any;
        webContentLink: any;
        isPublic: boolean;
    }>;
    /** exportFile
     * Google 문서/스프레드시트 등을 다른 형식으로 내보내기
     * @param fileId - 내보낼 파일 ID
     * @param mimeType - 내보낼 형식 (예: 'application/pdf')
     * @param destPath - 저장할 로컬 경로 (옵션)
     * @returns 내보내기 결과
     */
    exportFile: (fileId: string, mimeType: string, destPath?: string) => Promise<any>;
}
//# sourceMappingURL=googleDrive.d.ts.map