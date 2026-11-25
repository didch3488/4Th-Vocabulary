const PREFIX = 'sadie-voca-' + self.registration.scope + '-';
const CACHE = PREFIX + 'mobile-v4';
const ASSETS = ['./', './index.html', './manifest.json', './icon192.png', './icon512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&(k.startsWith(PREFIX)||k==='vocab-icon-v2-'+self.registration.scope)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event => {
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||!url.href.startsWith(self.registration.scope))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  try{const response=await fetch(event.request); if(response.ok) await cache.put(event.request,response.clone()); return response;}
  catch(error){const cached=await cache.match(event.request);if(cached)return cached;if(event.request.mode==='navigate'){const home=await cache.match('./index.html');if(home)return home;}throw error;}
 }));
});
