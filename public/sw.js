/* Veylora service worker — app-shell + runtime caching for full offline use.
   Installs under any base path (GitHub Pages subpath included) by resolving
   every URL against the registration scope, so it works at /, /veylora/, etc.
   Bump CACHE_VERSION when you ship new builds. */

const CACHE_VERSION = 'veylora-shell-v1';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const SCOPE = self.registration.scope;
const toAbs = (path) => new URL(path, SCOPE).href;
const SHELL_KEY = toAbs('.');
const SHELL_URLS = [
  '.',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-512-maskable.png',
  'apple-touch-icon.png'
].map(toAbs);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/**
 * Cache-first for static assets (hashed build files, icons, fonts) with
 * background refresh (stale-while-revalidate). Cache is effectively permanent.
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
      })
      .catch(() => {});
    return cached;
  }
  const response = await fetch(request);
  if (response && response.ok) {
    const copy = response.clone();
    caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

/**
 * Network-first for navigations so the newest app shell is used when online,
 * falling back to the cached shell (the SPA) when offline — any route like
 * /veylora/trip/history is served from the cached index.html.
 */
async function navigationFallback(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(SHELL_CACHE).then((cache) => cache.put(SHELL_KEY, copy));
    }
    return response;
  } catch {
    const cached = await caches.match(SHELL_KEY);
    if (cached) return cached;
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === new URL('sw.js', SCOPE).pathname) return;
  if (url.pathname === new URL('manifest.webmanifest', SCOPE).pathname) return;

  event.respondWith(
    request.mode === 'navigate' || request.destination === 'document'
      ? navigationFallback(request)
      : cacheFirst(request)
  );
});