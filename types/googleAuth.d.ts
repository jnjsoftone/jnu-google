export declare class GoogleAuth {
    tokenPath: string;
    crendentialsPath: string;
    scopes: string[];
    constructor({ user, type, sn, scopeDir, authDir }?: {
        user?: string | undefined;
        type?: string | undefined;
        sn?: number | undefined;
        scopeDir?: string | undefined;
        authDir?: string | undefined;
    });
    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    loadSavedCredentialsIfExist(): Promise<import("google-auth-library/build/src/auth/googleauth").JSONClient | null>;
    /**
     * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    saveCredentials(client: any): Promise<void>;
    /**
     * Load or request or authorization to call APIs.
     */
    authorize(): Promise<any>;
    refreshAccessToken(client: any): Promise<any>;
}
//# sourceMappingURL=googleAuth.d.ts.map