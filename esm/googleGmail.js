function i(i,e,t){return e in i?Object.defineProperty(i,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):i[e]=t,i}import{google as e}from"googleapis";import{GoogleAuth as t}from"./googleAuth.js";export class GoogleGmail{async init(){let i=await this.googleAuth.authorize();this.service=e.gmail({version:"v1",auth:i})}constructor({user:e="bigwhitekmc",type:o="oauth2",sn:s=0,scopeDir:r="",authDir:a=""}={}){i(this,"service",void 0),i(this,"googleAuth",void 0),i(this,"listGmails",async()=>{await this.service}),this.googleAuth=new t({user:e,type:o,sn:s,scopeDir:r,authDir:a})}}