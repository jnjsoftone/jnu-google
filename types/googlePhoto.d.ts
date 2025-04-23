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
     */
    init(): Promise<void>;
    getAlbums(): Promise<any>;
    getPhotos(pageSize?: number): Promise<any>;
}
//# sourceMappingURL=googlePhoto.d.ts.map