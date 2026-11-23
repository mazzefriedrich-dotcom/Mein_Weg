/* Mein Wegbegleiter: Service Worker.
   Neue Versionen werden nur geladen und WARTEN. Aktiv werden sie erst,
   wenn Erika in der App auf „Update annehmen“ tippt. */
const C='mein-helfer-v67';
const APP=['./','index.html','manifest.json','icon-192.png','icon-512.png','fundament-poster.html','fundament-kurz.html','fundament-kurz.pdf','qr.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(APP)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data&&e.data.t==='update-annehmen')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin&&(r.mode==='navigate'||APP.some(p=>p!=='./'&&u.pathname.endsWith('/'+p)))){
    /* Programm-Dateien: immer die angenommene Version aus dem Speicher */
    e.respondWith(caches.open(C).then(c=>c.match(r.mode==='navigate'?'index.html':r,{ignoreSearch:true}).then(m=>m||fetch(r))));return}
  /* Inhalte wie „Neu erklärt“ und „Was ist neu“: frisch aus dem Netz, sonst gespeichert */
  e.respondWith(fetch(r).then(res=>{if(res.ok&&u.origin===location.origin){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))}return res}).catch(()=>caches.match(r)))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c)return c.focus()}return self.clients.openWindow((e.notification.data&&e.notification.data.url)||'./index.html')}))});
