const CACHE='apartman-jedla-v1';
const PRE=['./','./index.html','./images/13.jpg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRE).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const url=new URL(req.url); if(url.origin!==location.origin)return;
  if(/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url.pathname)){
    e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(req);if(hit)return hit;const res=await fetch(req);if(res&&res.status===200)c.put(req,res.clone());return res;}).catch(()=>fetch(req)));
    return;
  }
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(req);const net=fetch(req).then(res=>{if(res&&res.status===200)c.put(req,res.clone());return res;}).catch(()=>hit);return hit||net;}));
});
