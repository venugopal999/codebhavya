// Keep this cache limited to public app resources. Quiz and Placement use live
// signed-in data and must always go to the network.
const CACHE_NAME = 'codebhavya-public-shell-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE = [OFFLINE_URL, '/images/codebhavya-icon-192.png', '/images/codebhavya-icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('codebhavya-public-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.mode !== 'navigate' || request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || /^\/(Quiz|Placement)(\/|$)/i.test(url.pathname)) return;

  // Load lessons normally when online. The offline page does not claim that
  // lessons or student records are available without a connection.
  event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
});
