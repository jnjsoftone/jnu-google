/** googleDrive
 *
 * Description
 *   - A Class For Handling GoogleDrive
 *
 * Functions
 *   [X] Authentication for GoogleSheet
 *   [X] listFiles
 *
 * Usages
 *   -
 *
 * Requirements
 *   - npm install googleapis
 *   - ./googleAuth
 *
 * References
 *   - https://developers.google.com/drive/api/quickstart/nodejs?hl=ko
 *   - https://developers.google.com/drive/api/reference/rest?hl=ko
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
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
    init(): Promise<void>;
    /** listFiles
     *  list Files in google drive
     */
    listFiles: () => Promise<any>;
}
//# sourceMappingURL=googleDrive.d.ts.map