function e(e,i,t){return i in e?Object.defineProperty(e,i,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[i]=t,e}import{google as i}from"googleapis";import{GoogleAuth as t}from"./googleAuth.js";export class GoogleDrive{async init(){let e=await this.googleAuth.authorize();this.service=i.drive({version:"v3",auth:e})}constructor({user:i="bigwhitekmc",type:o="oauth2",sn:s=0,scopeDir:r="",authDir:l=""}={}){e(this,"service",void 0),e(this,"googleAuth",void 0),e(this,"listFiles",async()=>{let e=await this.service,i=(await e.files.list({pageSize:10,fields:"nextPageToken, files(id, name)"})).data.files;if(i?.length===0){console.log("No files found.");return}return i}),this.googleAuth=new t({user:i,type:o,sn:s,scopeDir:r,authDir:l})}}