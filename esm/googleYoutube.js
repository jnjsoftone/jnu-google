function t(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}import{google as e}from"googleapis";import{GoogleAuth as i}from"./googleAuth.js";let s=["channelId","publishedAt","title","description","thumbnail"];function a(t={},e=s,i="high"){let l={};for(let s of e)if("thumbnail"===s)try{l[s]=`=image("${t.thumbnails[i].url}")`}catch{l[s]=""}else s.endsWith("_ko")?l[s.slice(0,-2)]=t.localized[s.split("_")[0]]:l[s]=t[s];return l}export class Youtube{async init(){let t=await this.googleAuth.authorize();this.service=e.youtube({version:"v3",auth:t})}async search(t={}){let e=t.q||"gemini",i=t.order||"relevance",s=t.part||"snippet".split(","),a=t.maxResults||100;return(await this.service.search.list({q:e,order:i,part:s,maxResults:a})).data.items}async channelIdByCustomUrl(t){return t=t.startsWith("@")?t.substring(1):t,(await this.search({q:t}))[0].id.channelId}async subscriptions_(){let t;let e=[];do{let i=await this.service.subscriptions.list({part:"id,snippet".split(","),mine:!0,maxResults:50,pageToken:t||void 0});e.push(...i.data.items),t=i.data.nextPageToken||void 0}while(t)return e}async subscriptions(){let t=await this.subscriptions_(),e=[];for(let i of t){let t={id:i.id};Object.assign(t,a(i.snippet)),e.push(t)}return e}async channelInfo_(t){let e=(await this.service.channels.list({part:"snippet,contentDetails".split(","),id:t.split(","),maxResults:25})).data.items;return void 0==e||0==e.length?[]:e}async channelInfo(t,e="high"){let i=(await this.channelInfo_(t))[0],l=i.contentDetails.relatedPlaylists,n={channelId:t,likes:"",uploads:""};return Object.assign(n,a(i.snippet,["customUrl",...s.slice(1),"title_ko","description_ko"],e)),n.likes=l.likes,n.uploads=l.uploads,n}async channelInfoByCustomUrl(t,e="high"){return this.channelInfo(await this.channelIdByCustomUrl(t),e)}async channelPlaylists_(t){let e;let i=[];do{let s=await this.service.playlists.list({part:"snippet,contentDetails".split(","),channelId:t,maxResults:50,pageToken:e||void 0});i.push(...s.data.items),e=s.data.nextPageToken||void 0}while(e)return i}async channelPlaylists(t,e="high"){let i=[];for(let l of(await this.channelPlaylists_(t))){let t={playlistId:l.id,itemCount:0};Object.assign(t,a(l.snippet,s.concat(["title_ko","description_ko"]),e)),t.itemCount=l.contentDetails.itemCount,i.push(t)}return i}async channelPlaylistsByCustomUrl(t){return await this.channelPlaylists(await this.channelIdByCustomUrl(t))}async videosByPlaylist_(t){let e;let i=[];do{let s=await this.service.playlistItems.list({part:"snippet,contentDetails".split(","),playlistId:t,maxResults:50,pageToken:e||void 0});i.push(...s.data.items),e=s.data.nextPageToken||void 0}while(e)return i}async videosByPlaylist(t,e="high"){let i=[];for(let l of(await this.videosByPlaylist_(t))){let t={videoId:l.contentDetails.videoId};Object.assign(t,a(l.snippet,s,e)),i.push(t)}return i}async myPlaylists_(){let t;let e=[];do{let i=await this.service.playlists.list({part:"snippet,contentDetails".split(","),mine:!0,maxResults:50,pageToken:t||void 0});e.push(...i.data.items),t=i.data.nextPageToken||void 0}while(t)return e}async myPlaylists(t="high"){let e=[];for(let i of(await this.myPlaylists_())){let l={playlistId:i.id,itemCount:0};Object.assign(l,a(i.snippet,s.concat(["title_ko","description_ko"]),t)),l.itemCount=i.contentDetails.itemCount,e.push(l)}return e}async getWatchLaterPlaylistId(){try{let t=await this.service.channels.list({part:"contentDetails",mine:!0});if(t.data.items&&t.data.items.length>0)return t.data.items[0].contentDetails.relatedPlaylists.watchLater;return null}catch(t){return console.error("'나중에 볼 동영상' 플레이리스트 ID 가져오기 오류:",t),null}}async getWatchLaterVideos(t=50){let e=await this.getWatchLaterPlaylistId();if(!e)return console.error("'나중에 볼 동영상' 플레이리스트 ID를 가져올 수 없습니다."),[];try{return(await this.videosByPlaylist(e)).slice(0,t)}catch(t){return console.error("'나중에 볼 동영상' 가져오기 오류:",t),[]}}async getMyChannelId(){try{let t=await this.service.channels.list({part:"id,snippet".split(","),mine:!0});if(!t.data.items||!(t.data.items.length>0))return console.log("No channel found."),null;{let e=t.data.items[0].id;return console.log("Your channel ID is:",e),e}}catch(t){return console.error("Error fetching channel ID:",t),null}}async getRelatedPlaylists(){return(await this.service.channels.list({part:"contentDetails",mine:!0})).data.items[0].contentDetails.relatedPlaylists}async myPlaylistItems(t="LL"){let e;let i=[];do{let s=await this.service.playlistItems.list({part:"snippet,contentDetails",playlistId:t,maxResults:50,pageToken:e||void 0});i.push(...s.data.items),e=s.data.nextPageToken||void 0}while(e)return i}constructor({user:e="bigwhitekmc",type:s="oauth2",sn:a=0,scopeDir:l="",authDir:n=""}={}){t(this,"service",void 0),t(this,"googleAuth",void 0),this.googleAuth=new i({user:e,type:s,sn:a,scopeDir:l,authDir:n})}}