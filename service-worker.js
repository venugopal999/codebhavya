// Keep this cache limited to public app resources. Quiz and Placement use live
// signed-in data and must always go to the network.
const CACHE_NAME = 'codebhavya-public-shell-v2';
const LESSON_CACHE = 'codebhavya-network-lessons-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE = [OFFLINE_URL, '/images/codebhavya-icon-192.png', '/images/codebhavya-icon-512.png'];
const NETWORK_ASSETS = new Set([
  '/style.css', '/images/codebhavya-main-logo.png', '/images/codebhavya-icon-32.png',
  '/install-course.js', '/offline-networks.js',
  '/Computer-Networks/networks.css', '/Computer-Networks/networks.js'
]);

function networkLesson(path) {
  return path === '/Computer-Networks/' || path === '/Computer-Networks/index.html' ||
    /^\/Computer-Networks\/level-(0[1-9]|1[0-2])-[a-z0-9-]+\.html$/.test(path);
}

function cachePath(url) {
  return url.pathname === '/Computer-Networks/' ? '/Computer-Networks/index.html' : url.pathname;
}

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
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || /^\/(Quiz|Placement)(\/|$)/i.test(url.pathname)) return;

  const isLesson = networkLesson(url.pathname);
  const isAsset = NETWORK_ASSETS.has(url.pathname);
  if (request.mode !== 'navigate' && !isAsset) return;

  // Only resources a student deliberately saved can be served offline.
  // Keep online navigation network-first so published lessons stay current.
  event.respondWith((async () => {
    const lessonCache = (isLesson || isAsset) ? await caches.open(LESSON_CACHE) : null;
    const path = cachePath(url);
    try {
      const response = await fetch(request);
      if (lessonCache && response.ok && response.type === 'basic' &&
          await lessonCache.match(path)) {
        event.waitUntil(lessonCache.put(path, response.clone()).catch(() => {}));
      }
      return response;
    } catch (error) {
      if (lessonCache) {
        const saved = await lessonCache.match(path);
        if (saved) return saved;
      }
      if (request.mode === 'navigate') return caches.match(OFFLINE_URL);
      throw error;
    }
  })());
});
