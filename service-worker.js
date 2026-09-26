// Cache only public lessons that a student explicitly saves. Quiz and Placement
// always use the network, including their pages, scripts, and signed-in data.
const SHELL_CACHE = 'codebhavya-public-shell-v5';
const OFFLINE_URL = '/offline.html';
const SHELL_FILES = [
  OFFLINE_URL, '/saved-lessons.html', '/saved-lessons.js',
  '/offline-course-catalog.js',
  '/course-mobile-sidebar.css', '/course-mobile-sidebar.js',
  '/images/codebhavya-icon-192.png', '/images/codebhavya-icon-512.png'
];
const SHELL_PATHS = new Set(SHELL_FILES);
const COURSE_CACHES = {
  'Computer-Networks': 'codebhavya-network-lessons-v1',
  'Operating-Systems': 'codebhavya-course-os-v1',
  DBMS: 'codebhavya-course-dbms-v1',
  Maths: 'codebhavya-course-maths-v1',
  'C-Programming': 'codebhavya-course-c-v1',
  'Data-Structures': 'codebhavya-course-dsa-v1',
  'Advanced-Data-Structures': 'codebhavya-course-ads-v1',
  Python: 'codebhavya-course-python-v1',
  'AI-ML': 'codebhavya-course-aiml-v1',
  Java: 'codebhavya-course-java-v1',
  'Full-Stack': 'codebhavya-course-fullstack-v1',
  'Web-Technologies': 'codebhavya-course-web-v1'
};
const COURSE_CACHE_NAMES = new Set(Object.values(COURSE_CACHES));
const ASSET_FILE = /\.(css|js|png|jpe?g|webp|gif|svg|woff2?|ttf)$/i;

function courseCacheFor(path) {
  const folder = path.split('/')[1];
  return Object.prototype.hasOwnProperty.call(COURSE_CACHES, folder) ? COURSE_CACHES[folder] : null;
}

function cacheKey(path, cacheName) {
  if (path.endsWith('/') && cacheName) return path + 'index.html';
  return path;
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names
      .filter(name => name.startsWith('codebhavya-public-shell-') && name !== SHELL_CACHE)
      .map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || /^\/(Quiz|Placement)(\/|$)/i.test(url.pathname)) return;

  const navigation = request.mode === 'navigate';
  const courseCache = courseCacheFor(url.pathname);
  const shellFile = SHELL_PATHS.has(url.pathname);
  if (!navigation && !shellFile && !ASSET_FILE.test(url.pathname)) return;

  event.respondWith((async () => {
    const names = await caches.keys();
    const candidates = courseCache && navigation ? [courseCache] : [...COURSE_CACHE_NAMES];
    const stored = [];
    for (const name of candidates) {
      if (!names.includes(name)) continue;
      const cache = await caches.open(name);
      const key = cacheKey(url.pathname, name);
      const match = await cache.match(key);
      if (match) stored.push({cache, key, match});
    }
    const shell = shellFile ? await caches.open(SHELL_CACHE) : null;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        for (const item of stored) {
          event.waitUntil(item.cache.put(item.key, response.clone()).catch(() => {}));
        }
        if (shell) event.waitUntil(shell.put(url.pathname, response.clone()).catch(() => {}));
      }
      return response;
    } catch (error) {
      if (stored.length) return stored[0].match;
      if (shell) {
        const fallback = await shell.match(url.pathname);
        if (fallback) return fallback;
      }
      if (navigation) return caches.match(OFFLINE_URL);
      throw error;
    }
  })());
});
