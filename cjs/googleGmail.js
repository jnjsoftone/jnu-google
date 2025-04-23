"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"GoogleGmail",{enumerable:!0,get:function(){return s}});const e=require("googleapis"),r=require("./googleAuth.js");function t(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}class s{async init(){await this.googleAuth.init();let r=await this.googleAuth.authorize();this.service=e.google.gmail({version:"v1",auth:r})}async listGmails(e={}){let{q:r,labelIds:t,maxResults:s,pageToken:a}=e,n={};return r&&(n.q=r),t&&(n.labelIds=t),s&&(n.maxResults=s),a&&(n.pageToken=a),this.service.users.messages.list({userId:"me",...n})}async getGmail(e,r="full"){return this.service.users.messages.get({userId:"me",id:e,format:r})}async sendGmail(e){let{to:r,subject:t,text:s,html:a,from:n,cc:i,bcc:l,attachments:u}=e,o=[`From: ${n||"me"}`,`To: ${r}`,`Subject: ${t}`];i&&i.length>0&&o.push(`Cc: ${i.join(", ")}`);let c=o.join("\r\n")+"\r\n\r\n";if(a){let e=`boundary_${Date.now()}`;c=`MIME-Version: 1.0\r
Content-Type: multipart/alternative; boundary=${e}\r
\r
--${e}\r
Content-Type: text/plain; charset=UTF-8\r
\r
${s}\r
\r
--${e}\r
Content-Type: text/html; charset=UTF-8\r
\r
${a}\r
\r
--${e}--`}else c+=s;if(u&&u.length>0){let e=`boundary_${Date.now()}`,r=`MIME-Version: 1.0\r
Content-Type: multipart/mixed; boundary=${e}\r
\r
`;for(let t of(r+=`--${e}\r
Content-Type: text/plain; charset=UTF-8\r
\r
${s}\r
\r
`,u))r+=`--${e}\r
Content-Type: ${t.contentType}; name="${t.filename}"\r
Content-Disposition: attachment; filename="${t.filename}"\r
Content-Transfer-Encoding: base64\r
\r
${t.content}\r
\r
`;r+=`--${e}--`,c=r}let d=Buffer.from(c).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return this.service.users.messages.send({userId:"me",requestBody:{raw:d}})}async createDraft(e){let{to:r,subject:t,text:s,html:a,from:n,cc:i,bcc:l}=e,u=[`From: ${n||"me"}`,`To: ${r}`,`Subject: ${t}`];i&&i.length>0&&u.push(`Cc: ${i.join(", ")}`);let o=u.join("\r\n")+"\r\n\r\n";if(a){let e=`boundary_${Date.now()}`;o=`MIME-Version: 1.0\r
Content-Type: multipart/alternative; boundary=${e}\r
\r
--${e}\r
Content-Type: text/plain; charset=UTF-8\r
\r
${s}\r
\r
--${e}\r
Content-Type: text/html; charset=UTF-8\r
\r
${a}\r
\r
--${e}--`}else o+=s;let c=Buffer.from(o).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return this.service.users.drafts.create({userId:"me",requestBody:{message:{raw:c}}})}async updateDraft(e,r){let{to:t,subject:s,text:a,html:n,from:i,cc:l,bcc:u}=r,o=[`From: ${i||"me"}`,`To: ${t}`,`Subject: ${s}`];l&&l.length>0&&o.push(`Cc: ${l.join(", ")}`);let c=o.join("\r\n")+"\r\n\r\n";if(n){let e=`boundary_${Date.now()}`;c=`MIME-Version: 1.0\r
Content-Type: multipart/alternative; boundary=${e}\r
\r
--${e}\r
Content-Type: text/plain; charset=UTF-8\r
\r
${a}\r
\r
--${e}\r
Content-Type: text/html; charset=UTF-8\r
\r
${n}\r
\r
--${e}--`}else c+=a;let d=Buffer.from(c).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return this.service.users.drafts.update({userId:"me",id:e,requestBody:{message:{raw:d}}})}async deleteDraft(e){return this.service.users.drafts.delete({userId:"me",id:e})}async listDrafts(e,r){let t={};return e&&(t.maxResults=e),r&&(t.pageToken=r),this.service.users.drafts.list({userId:"me",...t})}async getDraft(e,r="full"){return this.service.users.drafts.get({userId:"me",id:e,format:r})}async listLabels(){return this.service.users.labels.list({userId:"me"})}async createLabel(e){return this.service.users.labels.create({userId:"me",requestBody:e})}async updateLabel(e,r){return this.service.users.labels.patch({userId:"me",id:e,requestBody:r})}async deleteLabel(e){return this.service.users.labels.delete({userId:"me",id:e})}async listThreads(e={}){let{q:r,labelIds:t,maxResults:s,pageToken:a}=e,n={};return r&&(n.q=r),t&&(n.labelIds=t),s&&(n.maxResults=s),a&&(n.pageToken=a),this.service.users.threads.list({userId:"me",...n})}async getThread(e,r="full"){return this.service.users.threads.get({userId:"me",id:e,format:r})}async modifyThread(e,r){return this.service.users.threads.modify({userId:"me",id:e,requestBody:r})}async trashThread(e){return this.service.users.threads.trash({userId:"me",id:e})}async untrashThread(e){return this.service.users.threads.untrash({userId:"me",id:e})}async deleteThread(e){return this.service.users.threads.delete({userId:"me",id:e})}constructor({user:e="bigwhitekmc",type:s="oauth2",sn:a=0,scopeDir:n="Apis/google/spec/",authDir:i="Apis/google/"}={}){t(this,"service",void 0),t(this,"googleAuth",void 0),this.googleAuth=new r.GoogleAuth({user:e,type:s,sn:a,scopeDir:n,authDir:i})}}