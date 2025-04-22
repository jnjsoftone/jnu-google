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

// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules
import * as fs from 'fs';
import * as path from 'path';

// ? External Modules
import { google } from "googleapis";

// ? Local Modules
import { GoogleAuth } from "./googleAuth.js";

// & Types AREA
// &---------------------------------------------------------------------------
// 구글 드라이브 파일 타입 정의
export interface DriveFile {
  id?: string;
  name?: string;
  mimeType?: string;
  description?: string;
  parents?: string[];
  [key: string]: any;
}

// 파일 권한 타입 정의
export interface Permission {
  id?: string;
  type?: 'user' | 'group' | 'domain' | 'anyone';
  role?: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
  emailAddress?: string;
  domain?: string;
  allowFileDiscovery?: boolean;
  [key: string]: any;
}

// 파일 검색 옵션 타입 정의
export interface SearchOptions {
  pageSize?: number;
  orderBy?: string;
  fields?: string;
  q?: string;
  pageToken?: string;
}

// & Class AREA
// &---------------------------------------------------------------------------
export class GoogleDrive {
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
    const auth = await this.googleAuth.authorize();
    this.service = google.drive({ version: "v3", auth });
    return this;
  }

  /** listFiles
   *  list Files in google drive
   * @param options - 파일 목록 조회 옵션
   * @returns 파일 목록
   */
  listFiles = async (options: SearchOptions = {}) => {
    const drive = await this.service;
    const defaultOptions = {
      pageSize: 30,
      fields: "nextPageToken, files(id, name, mimeType, description, createdTime, modifiedTime, size, parents, webViewLink)",
      ...options
    };
    
    const res = await drive.files.list(defaultOptions);
    const files = res.data.files;
    
    if (files?.length === 0) {
      console.log("No files found.");
      return [];
    }
    
    return {
      files,
      nextPageToken: res.data.nextPageToken
    };
  };

  /** searchFiles
   * 파일 검색
   * @param query - 검색 쿼리 (예: "name contains 'test'")
   * @param options - 추가 검색 옵션
   * @returns 검색된 파일 목록
   */
  searchFiles = async (query: string, options: SearchOptions = {}) => {
    return this.listFiles({
      q: query,
      ...options
    });
  };

  /** getFile
   * 파일 정보 조회
   * @param fileId - 파일 ID
   * @param fields - 조회할 필드
   * @returns 파일 정보
   */
  getFile = async (fileId: string, fields: string = "id, name, mimeType, description, createdTime, modifiedTime, size, parents, webViewLink") => {
    const drive = await this.service;
    const response = await drive.files.get({
      fileId,
      fields
    });
    return response.data;
  };

  /** createFile
   * 파일 생성 (메타데이터만 생성)
   * @param fileMetadata - 생성할 파일 메타데이터
   * @returns 생성된 파일 정보
   */
  createFile = async (fileMetadata: DriveFile) => {
    const drive = await this.service;
    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name, mimeType, parents'
    });
    return response.data;
  };

  /** createFolder
   * 폴더 생성
   * @param folderName - 폴더 이름
   * @param parentId - 상위 폴더 ID (없으면 루트 폴더에 생성)
   * @returns 생성된 폴더 정보
   */
  createFolder = async (folderName: string, parentId?: string) => {
    const fileMetadata: DriveFile = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };
    
    if (parentId) {
      fileMetadata.parents = [parentId];
    }
    
    return this.createFile(fileMetadata);
  };

  /** uploadFile
   * 파일 업로드
   * @param filePath - 업로드할 로컬 파일 경로
   * @param options - 업로드 옵션 (이름, 설명, 부모 폴더 등)
   * @returns 업로드된 파일 정보
   */
  uploadFile = async (filePath: string, options: { name?: string, description?: string, parentId?: string, mimeType?: string } = {}) => {
    const drive = await this.service;
    
    // 파일이 존재하는지 확인
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // 파일 이름이 지정되지 않은 경우 경로에서 추출
    const fileName = options.name || path.basename(filePath);
    
    // 파일 메타데이터 구성
    const fileMetadata: DriveFile = {
      name: fileName
    };
    
    if (options.description) {
      fileMetadata.description = options.description;
    }
    
    if (options.parentId) {
      fileMetadata.parents = [options.parentId];
    }
    
    // 파일 미디어 설정
    const media = {
      body: fs.createReadStream(filePath),
      mimeType: options.mimeType
    };
    
    // 파일 업로드 실행
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, mimeType, webViewLink, size, createdTime'
    });
    
    return response.data;
  };

  /** updateFile
   * 파일 메타데이터 업데이트
   * @param fileId - 파일 ID
   * @param fileMetadata - 업데이트할 메타데이터
   * @returns 업데이트된 파일 정보
   */
  updateFile = async (fileId: string, fileMetadata: DriveFile) => {
    const drive = await this.service;
    const response = await drive.files.update({
      fileId,
      resource: fileMetadata,
      fields: 'id, name, mimeType, description, modifiedTime'
    });
    return response.data;
  };

  /** updateFileContent
   * 파일 콘텐츠 업데이트
   * @param fileId - 파일 ID
   * @param filePath - 업데이트할 로컬 파일 경로
   * @param mimeType - 파일 MIME 타입
   * @returns 업데이트된 파일 정보
   */
  updateFileContent = async (fileId: string, filePath: string, mimeType?: string) => {
    const drive = await this.service;
    
    // 파일이 존재하는지 확인
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // 파일 미디어 설정
    const media = {
      body: fs.createReadStream(filePath),
      mimeType
    };
    
    // 파일 콘텐츠 업데이트 실행
    const response = await drive.files.update({
      fileId,
      media: media,
      fields: 'id, name, mimeType, modifiedTime, size'
    });
    
    return response.data;
  };

  /** deleteFile
   * 파일 삭제
   * @param fileId - 삭제할 파일 ID
   * @returns 삭제 성공 여부
   */
  deleteFile = async (fileId: string) => {
    const drive = await this.service;
    await drive.files.delete({
      fileId
    });
    return true;
  };

  /** downloadFile
   * 파일 다운로드
   * @param fileId - 다운로드할 파일 ID
   * @param destPath - 저장할 로컬 경로
   * @returns 다운로드 결과
   */
  downloadFile = async (fileId: string, destPath: string) => {
    const drive = await this.service;
    
    // 파일 메타데이터 가져오기
    const fileInfo = await this.getFile(fileId);
    
    // 디렉토리가 존재하는지 확인하고 없으면 생성
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 파일 다운로드
    const response = await drive.files.get({
      fileId,
      alt: 'media'
    }, { responseType: 'stream' });
    
    return new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(destPath);
      response.data
        .on('end', () => {
          resolve({
            success: true,
            path: destPath,
            fileInfo
          });
        })
        .on('error', (err: any) => {
          reject(err);
        })
        .pipe(dest);
    });
  };

  /** copyFile
   * 파일 복사
   * @param fileId - 복사할 파일 ID
   * @param options - 복사 옵션 (이름, 설명, 부모 폴더 등)
   * @returns 복사된 파일 정보
   */
  copyFile = async (fileId: string, options: { name?: string, description?: string, parentId?: string } = {}) => {
    const drive = await this.service;
    
    const fileMetadata: DriveFile = {};
    
    if (options.name) {
      fileMetadata.name = options.name;
    }
    
    if (options.description) {
      fileMetadata.description = options.description;
    }
    
    if (options.parentId) {
      fileMetadata.parents = [options.parentId];
    }
    
    const response = await drive.files.copy({
      fileId,
      resource: fileMetadata,
      fields: 'id, name, mimeType, parents, webViewLink'
    });
    
    return response.data;
  };

  /** moveFile
   * 파일 이동 (부모 폴더 변경)
   * @param fileId - 이동할 파일 ID
   * @param newParentId - 새 부모 폴더 ID
   * @param removeParents - 제거할 부모 폴더 ID (지정하지 않으면 자동으로 현재 부모 폴더 제거)
   * @returns 이동된 파일 정보
   */
  moveFile = async (fileId: string, newParentId: string, removeParents?: string) => {
    const drive = await this.service;
    
    // 현재 부모 폴더 ID를 가져오기 (removeParents가 지정되지 않은 경우)
    let parentsToRemove = removeParents;
    
    if (!parentsToRemove) {
      const file = await this.getFile(fileId, 'parents');
      parentsToRemove = file.parents?.join(',');
    }
    
    const response = await drive.files.update({
      fileId,
      addParents: newParentId,
      removeParents: parentsToRemove,
      fields: 'id, name, parents'
    });
    
    return response.data;
  };

  /** getFilePermissions
   * 파일 권한 조회
   * @param fileId - 파일 ID
   * @returns 권한 목록
   */
  getFilePermissions = async (fileId: string) => {
    const drive = await this.service;
    
    const response = await drive.permissions.list({
      fileId,
      fields: 'permissions(id, type, role, emailAddress, domain)'
    });
    
    return response.data.permissions || [];
  };

  /** shareFile
   * 파일 공유 설정
   * @param fileId - 공유할 파일 ID
   * @param permission - 권한 설정
   * @param sendNotification - 알림 이메일 발송 여부
   * @returns 생성된 권한 정보
   */
  shareFile = async (fileId: string, permission: Permission, sendNotification: boolean = false) => {
    const drive = await this.service;
    
    const response = await drive.permissions.create({
      fileId,
      resource: permission,
      sendNotificationEmail: sendNotification,
      fields: 'id, type, role, emailAddress, domain'
    });
    
    return response.data;
  };

  /** revokePermission
   * 파일 권한 취소
   * @param fileId - 파일 ID
   * @param permissionId - 취소할 권한 ID
   * @returns 취소 성공 여부
   */
  revokePermission = async (fileId: string, permissionId: string) => {
    const drive = await this.service;
    
    await drive.permissions.delete({
      fileId,
      permissionId
    });
    
    return true;
  };

  /** generatePublicUrl
   * 파일의 공개 URL 생성
   * @param fileId - 파일 ID
   * @param publish - 공개 여부 (true: 공개, false: 비공개)
   * @returns 파일 URL 정보
   */
  generatePublicUrl = async (fileId: string, publish: boolean = true) => {
    const drive = await this.service;
    
    if (publish) {
      // anyone에게 reader 권한 부여
      await this.shareFile(fileId, {
        type: 'anyone',
        role: 'reader'
      });
    } else {
      // 기존 anyone 권한 조회 후 삭제
      const permissions = await this.getFilePermissions(fileId);
      const anyonePermission = permissions.find(p => p.type === 'anyone');
      
      if (anyonePermission) {
        await this.revokePermission(fileId, anyonePermission.id);
      }
    }
    
    // 파일 정보 조회하여 웹뷰 링크 반환
    const file = await this.getFile(fileId, 'webViewLink, webContentLink');
    
    return {
      webViewLink: file.webViewLink,
      webContentLink: file.webContentLink,
      isPublic: publish
    };
  };

  /** exportFile
   * Google 문서/스프레드시트 등을 다른 형식으로 내보내기
   * @param fileId - 내보낼 파일 ID
   * @param mimeType - 내보낼 형식 (예: 'application/pdf')
   * @param destPath - 저장할 로컬 경로 (옵션)
   * @returns 내보내기 결과
   */
  exportFile = async (fileId: string, mimeType: string, destPath?: string) => {
    const drive = await this.service;
    
    // 파일 메타데이터 가져오기
    const fileInfo = await this.getFile(fileId);
    
    // 파일 내보내기
    const response = await drive.files.export({
      fileId,
      mimeType
    }, { responseType: 'stream' });
    
    // 로컬 파일로 저장하기를 원하는 경우
    if (destPath) {
      // 디렉토리가 존재하는지 확인하고 없으면 생성
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      return new Promise((resolve, reject) => {
        const dest = fs.createWriteStream(destPath);
        response.data
          .on('end', () => {
            resolve({
              success: true,
              path: destPath,
              fileInfo
            });
          })
          .on('error', (err: any) => {
            reject(err);
          })
          .pipe(dest);
      });
    }
    
    // 스트림 데이터 반환
    return response.data;
  };
}

// & Test AREA
// &---------------------------------------------------------------------------
// const gd = new GoogleDrive();
// await gd.init();

// // * googleDrive 테스트
// const files = await gd.listFiles();
// console.log("files", files);
