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
    loadSavedCredentialsIfExist(): Promise<OAuth2Client | null>;
    saveCredentials(client: OAuth2Client): Promise<void>;
    authorize(): Promise<OAuth2Client>;
}
//# sourceMappingURL=googleAuth.d.ts.map