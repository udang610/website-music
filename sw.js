// =====================================================================
// Lullaby Service Worker (v1.0.0)
// Provides PWA offline shell & instant loading for TWA Android APK
// =====================================================================

const CACHE_NAME = 'lullaby-static-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './manifest.json',
  './manifest.webmanifest',
  './images/icons/icon-192.png',
  './images/icons/icon-512.png',
  './images/icons/icon.svg',
  './js/data.js',
  './js/auth.js',
  './js/state.js',
  './js/player.js',
  './js/views.js',
  './js/playlist.js',
  './js/track-actions.js',
  './js/jam.js',
  './js/polaroid.js',
  './js/modals.js',
  './js/db.js',
  './js/app.js'
];

// Install: Cache essential app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[SW] Core assets pre-cache note:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-while-revalidate for static assets, network-first/bypass for audio & cloud APIs
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass non-GET requests
  if (req.method !== 'GET') return;

  // Bypass audio media files & stream range requests to avoid high memory/storage usage
  if (
    url.pathname.includes('/audio/') ||
    url.pathname.endsWith('.m4a') ||
    url.pathname.endsWith('.mp3') ||
    req.headers.has('range')
  ) {
    return;
  }

  // Bypass Supabase cloud database & YouTube live queries
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('youtube.com') ||
    url.hostname.includes('googlevideo.com') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // Stale-While-Revalidate for app shell
  event.respondWith(
    caches.match(req).then((cachedResp) => {
      const fetchPromise = fetch(req).then((networkResp) => {
        if (networkResp && networkResp.status === 200 && networkResp.type === 'basic') {
          const respClone = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, respClone);
          });
        }
        return networkResp;
      }).catch(() => cachedResp);

      return cachedResp || fetchPromise;
    })
  );
});
