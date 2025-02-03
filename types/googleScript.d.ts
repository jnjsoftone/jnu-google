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
export declare class GoogleScript {
    auth: any;
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
    init(): Promise<void>;
    runScript: (scriptId: string) => Promise<void>;
    createScript: (title: string, description?: string) => Promise<void>;
    addFile: (scriptId: string, name: string, type: string, source: string) => Promise<void>;
    addFiles: (scriptId: string, files: any[]) => Promise<void>;
}
//# sourceMappingURL=googleScript.d.ts.map