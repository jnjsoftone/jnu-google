/** googleSheets
 *
 * Description
 *   - A Class For Handling GoogleSheets
 *
 * Functions
 *   [X] Authentication for GoogleSheets
 *
 *   [X] getSheetNames
 *   [X] getValues
 *   [X] setValues
 *   [X] appendValues
 *   [ ] prependValues
 *   [ ] upsertValues(변경된 사항 반영 + 추가)
 *
 *
 * Usages
 *   -
 *
 * Requirements
 *   - npm install googleapis
 *   - ./googleAuth
 *
 * References
 *   - https://developers.google.com/sheets/api/samples/rowcolumn?hl=ko
 *   - https://stackoverflow.com/questions/74349894/update-cells-formatting-with-the-google-sheets-api-wrapping-and-alignment
 *   - https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets?hl=ko
 *   - https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request?hl=ko
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
/** arrToCell
 * @example
 *  cellA1Noation([2, 4])
 *  => "D2"
 */
export declare const arrToCell: (arr?: number[]) => string;
/** arrToCell
 * @example
 *  cellToArr("A2")
 *  => [1, 3]
 */
export declare const cellToArr: (cell?: string) => number[] | (string & any[]);
export declare class GoogleSheets {
    service: any;
    googleAuth: any;
    spreadsheetId: any;
    /** GoogleAuth 참조(googleAuth.ts)
     */
    constructor(spreadsheetId: string, { user, type, sn, scopeDir, authDir }: {
        user?: string;
        type?: string;
        sn?: number;
        scopeDir?: string;
        authDir?: string;
    });
    /** init
     */
    init(): Promise<void>;
    /** getSheetNames
     *   googleSheets 내에 있는 sheetName
     * @param all: true(전체 시트) | false(`_`로 시작하는 sheet 제외)
     */
    getSheetNames: (all?: boolean) => Promise<any>;
    getSheetId: (sheetName: string) => Promise<any>;
    /** getValues
     *   googleSheets(`spreadsheetId`) 내에 있는 `sheetName`의 시트에서 `range`에 해당하는 Data(rows) 반환
     */
    getValues: ({ range, sheetName }: {
        range?: string | undefined;
        sheetName?: string | undefined;
    }) => Promise<any>;
    /** setValues
     *   googleSheets(`spreadsheetId`) 내에 있는 `sheetName`의 시트에 `start` 셀부터 data(`values`, arrays of array)를 덮어씀(update)
     */
    setValues: ({ values, start, sheetName, valueInputOption, }: {
        values: any[][];
        start?: string | undefined;
        sheetName?: string | undefined;
        valueInputOption?: string | undefined;
    }) => Promise<void>;
    /** appendValues
     *   googleSheets(`spreadsheetId`) 내에 있는 `sheetName`의 시트에 기존 내용 뒤에 data(`values`, arrays of array)를 추가(update)
     */
    appendValues: ({ values, start, sheetName, valueInputOption, }: {
        values: any[][];
        start?: string | undefined;
        sheetName?: string | undefined;
        valueInputOption?: string | undefined;
    }) => Promise<void>;
    rangeObject_: (sheetName: string, range: number[]) => Promise<{
        sheetId: any;
        startRowIndex: number;
        endRowIndex: number;
        startColumnIndex: number;
        endColumnIndex: number;
    }>;
    setRowHeights: ({ startRowIndex, endRowIndex, height, sheetName, }: {
        startRowIndex?: number | undefined;
        endRowIndex?: number | undefined;
        height?: number | undefined;
        sheetName: string;
    }) => Promise<void>;
    setColumnWidths: ({ startColumnIndex, endColumnIndex, width, sheetName, }: {
        startColumnIndex?: number | undefined;
        endColumnIndex?: number | undefined;
        width?: number | undefined;
        sheetName: string;
    }) => Promise<void>;
    setVerticalAlign: ({ range, sheetName, wrapStrategy, verticalAlignment, }: {
        range?: number[] | undefined;
        sheetName: string;
        wrapStrategy?: string | undefined;
        verticalAlignment?: string | undefined;
    }) => Promise<void>;
    setBasicFormat: ({ range, sheetName, horizontalAlignment, fontSize, bold, backgroundColor, foregroundColor, }: {
        range?: number[] | undefined;
        sheetName: string;
        horizontalAlignment?: string | undefined;
        fontSize?: number | undefined;
        bold?: boolean | undefined;
        backgroundColor?: string | undefined;
        foregroundColor?: string | undefined;
    }) => Promise<void>;
    setBorders: ({ range, sheetName, top, bottom, left, right, innerHorizontal, innerVertical, }: {
        range?: number[] | undefined;
        sheetName: string;
        top?: any;
        bottom?: any;
        left?: any;
        right?: any;
        innerHorizontal?: any;
        innerVertical?: any;
    }) => Promise<void>;
}
//# sourceMappingURL=googleSheets.d.ts.map