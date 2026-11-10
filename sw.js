/* Версия вычисляется по содержимому сборки. Хранится только сам учебник. */
"use strict";
const PREFIX='network-school-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'6000b9009321029f';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
const absolute=path=>new URL(path,self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url),index=absolute('./index.html'),root=absolute('./');
 if(url.origin!==self.location.origin)return;
 const clean=url.origin+url.pathname;
 if(event.request.mode==='navigate'&&(clean===root||clean===index)){
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(index))||fetch(event.request)));return;
 }
 if(ASSETS.map(absolute).includes(clean))event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(clean))||fetch(event.request)));
});
self.addEventListener('message',event=>{
 if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
 if(event.data?.type==='OFFLINE_STATUS')event.waitUntil((async()=>{const cache=await caches.open(CACHE),matches=await Promise.all(ASSETS.map(path=>cache.match(absolute(path))));event.ports[0]?.postMessage({ready:matches.every(Boolean)});})());
});
