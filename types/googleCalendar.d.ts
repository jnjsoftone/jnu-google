/** googleCalendar
 *
 * Description
 *   - A Class For Handling GoogleCalendar
 *
 * Functions
 *   [X] Authentication for GoogleCalendar
 *   [] listCalendars
 *
 * Usages
 *   -
 *
 * Requirements
 *   - npm install googleapis
 *   - ./googleAuth
 *
 * References
 *   - https://developers.google.com/calendar/api/quickstart/nodejs?hl=ko
 *   - https://developers.google.com/calendar/api/reference/rest?hl=ko
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
export declare class GoogleCalendar {
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
    /** listCalendars
     */
    listCalendars: () => Promise<void>;
    /** listEvents
     */
    listEvents: () => Promise<void>;
    /** createEvent
     */
    createEvent: (summary: any, startTime: any, endTime: any) => Promise<void>;
    updateEvent: (eventId: any, summary: any, startTime: any, endTime: any) => Promise<void>;
    deleteEvent: (eventId: any) => Promise<void>;
}
//# sourceMappingURL=googleCalendar.d.ts.map