function e(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}import{google as t}from"googleapis";import{GoogleAuth as s}from"./googleAuth.js";export const arrToCell=(e=[2,4])=>{let t=[`${e[0]}`],s=e[1]-1;for(;s>=0;)t.unshift(String.fromCharCode(s%26+65)),s=Math.floor(s/26)-1;return t.join("")};export const cellToArr=(e="A1")=>{if(Array.isArray(e))return e;let[t,s,r]=e.toUpperCase().match(/([A-Z]+)([0-9]+)/),a=0;return s.split("").forEach(e=>{a*=26,a+=e.charCodeAt(0)-65+1}),[parseInt(r),a]};let r=(e=[3,2],t=[1,2])=>`${arrToCell(e)}:${arrToCell([e[0]+t[0],e[1]+t[1]])}`,a=e=>parseInt(e,16)/255,i=e=>({red:a(e.slice(1,3)),green:a(e.slice(3,5)),blue:a(e.slice(5,7))}),d=e=>({style:e.style,color:i(e.color)});export class GoogleSheets{async init(){let e=await this.googleAuth.authorize();this.service=t.sheets({version:"v4",auth:e})}constructor(t,{user:a="bigwhitekmc",type:o="oauth2",sn:h=0,scopeDir:l="",authDir:n=""}){e(this,"service",void 0),e(this,"googleAuth",void 0),e(this,"spreadsheetId",void 0),e(this,"getSheetNames",async(e=!1)=>{let t=await this.service.spreadsheets.get({spreadsheetId:this.spreadsheetId}),s=t.data?.sheets?.map(e=>e?.properties?.title);return e?s:s?.filter(e=>!e?.startsWith("_"))}),e(this,"getSheetId",async e=>{let t=(await this.service.spreadsheets.get({spreadsheetId:this.spreadsheetId,fields:"sheets.properties"})).data.sheets;if(!t)return"";let s=t.find(t=>t.properties.title===e);if(!s)throw Error(`Sheet ${e} not found.`);return s.properties.sheetId}),e(this,"getValues",async({range:e="",sheetName:t=""})=>{let s=await this.service.spreadsheets.values.get({spreadsheetId:this.spreadsheetId,range:e?`${t}!${e}`:t}),r=await s.data.values;if(r&&0!==r.length)return r}),e(this,"setValues",async({values:e=[[]],start:t="A1",sheetName:s="",valueInputOption:a="USER_ENTERED"})=>{let i=r(cellToArr(t),[e.length,e[0].length]);await this.service.spreadsheets.values.update({spreadsheetId:this.spreadsheetId,range:i?`${s}!${i}`:s,valueInputOption:a,requestBody:{values:e}})}),e(this,"appendValues",async({values:e=[[]],start:t="A1",sheetName:s="",valueInputOption:a="USER_ENTERED"})=>{let i=r(cellToArr(t),[e.length,e[0].length]);await this.service.spreadsheets.values.append({spreadsheetId:this.spreadsheetId,range:i?`${s}!${i}`:s,valueInputOption:a,requestBody:{values:e}})}),e(this,"rangeObject_",async(e,t)=>({sheetId:await this.getSheetId(e),startRowIndex:t[0],endRowIndex:t[2],startColumnIndex:t[1],endColumnIndex:t[3]})),e(this,"setRowHeights",async({startRowIndex:e=0,endRowIndex:t=10,height:s=20,sheetName:r=""})=>{let a={updateDimensionProperties:{range:{sheetId:await this.getSheetId(r),dimension:"ROWS",startIndex:e,endIndex:t+1},properties:{pixelSize:s},fields:"pixelSize"}};await this.service.spreadsheets.batchUpdate({spreadsheetId:this.spreadsheetId,requestBody:{requests:[a]}})}),e(this,"setColumnWidths",async({startColumnIndex:e=0,endColumnIndex:t=10,width:s=100,sheetName:r=""})=>{let a={updateDimensionProperties:{range:{sheetId:await this.getSheetId(r),dimension:"COLUMNS",startIndex:e,endIndex:t+1},properties:{pixelSize:s},fields:"pixelSize"}};await this.service.spreadsheets.batchUpdate({spreadsheetId:this.spreadsheetId,requestBody:{requests:[a]}})}),e(this,"setVerticalAlign",async({range:e=[0,0,100,100],sheetName:t,wrapStrategy:s="WRAP",verticalAlignment:r="middle"})=>{let a={repeatCell:{range:await this.rangeObject_(t,e),cell:{userEnteredFormat:{wrapStrategy:s,verticalAlignment:r}},fields:"userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment"}};await this.service.spreadsheets.batchUpdate({spreadsheetId:this.spreadsheetId,requestBody:{requests:[a]}})}),e(this,"setBasicFormat",async({range:e=[0,0,100,100],sheetName:t,horizontalAlignment:s="left",fontSize:r=10,bold:a=!1,backgroundColor:d="#ffffff",foregroundColor:o="#000000"})=>{let h={repeatCell:{range:await this.rangeObject_(t,e),cell:{userEnteredFormat:{backgroundColor:i(d),horizontalAlignment:s,textFormat:{foregroundColor:i(o),fontSize:r,bold:a}}},fields:"userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"}};await this.service.spreadsheets.batchUpdate({spreadsheetId:this.spreadsheetId,requestBody:{requests:[h]}})}),e(this,"setBorders",async({range:e=[0,0,100,100],sheetName:t="",top:s={style:"SOLID",color:"#ff0000"},bottom:r={style:"SOLID",color:"#0000ff"},left:a={style:"SOLID",color:"#00ff00"},right:i={style:"SOLID",color:"#000000"},innerHorizontal:o={style:"SOLID",color:"#000000"},innerVertical:h={style:"SOLID",color:"#000000"}})=>{let l={updateBorders:{range:await this.rangeObject_(t,e),top:d(s),bottom:d(r),left:d(a),right:d(i),innerHorizontal:d(o),innerVertical:d(h)}};await this.service.spreadsheets.batchUpdate({spreadsheetId:this.spreadsheetId,requestBody:{requests:[l]}})}),this.googleAuth=new s({user:a,type:o,sn:h,scopeDir:l,authDir:n}),this.spreadsheetId=t}}