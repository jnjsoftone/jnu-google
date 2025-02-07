import { OAuth2Client } from 'google-auth-library';
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
    loadSavedCredentialsIfExist(): Promise<OAuth2Client | null>;
    /**
     * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    saveCredentials(client: OAuth2Client): Promise<void>;
    /**
     * Load or request authorization to call APIs.
     */
    authorize(): Promise<OAuth2Client>;
}
//# sourceMappingURL=googleAuth.d.ts.map