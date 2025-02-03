export declare class Youtube {
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
    search(options?: {
        q?: string;
        order?: string;
        part?: string[];
        maxResults?: number;
    }): Promise<any>;
    channelIdByCustomUrl(customUrl: string): Promise<string>;
    subscriptions_(): Promise<any[]>;
    subscriptions(): Promise<any[]>;
    channelInfo_(channelId: string): Promise<any[]>;
    channelInfo(channelId: string, thumbnail?: string): Promise<any>;
    channelInfoByCustomUrl(customUrl: string, thumbnail?: string): Promise<any>;
    channelPlaylists_(channelId: string): Promise<any[]>;
    channelPlaylists(channelId: string, thumbnail?: string): Promise<any[]>;
    channelPlaylistsByCustomUrl(customUrl: string): Promise<any[]>;
    videosByPlaylist_(playlistId: string): Promise<any[]>;
    videosByPlaylist(playlistId: string, thumbnail?: string): Promise<any[]>;
    myPlaylists_(): Promise<any[]>;
    myPlaylists(thumbnail?: string): Promise<any[]>;
    getWatchLaterPlaylistId(): Promise<string | null>;
    getWatchLaterVideos(maxResults?: number): Promise<any[]>;
    getMyChannelId(): Promise<string | null>;
    getRelatedPlaylists(): Promise<any>;
    myPlaylistItems(playlistId?: string): Promise<any[]>;
}
//# sourceMappingURL=googleYoutube.d.ts.map