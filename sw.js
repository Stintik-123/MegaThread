const CACHE = 'megathread-v8';
const PREVIEW_CACHE = 'megathread-previews-v1';
const ASSETS = [
  './',
  './index.html',
  './noscript.html',
  './css/style.css',
  './css/tokens.css',
  './css/base.css',
  './js/app.js',
  './js/data.js',
  './js/labels.js',
  './js/icons.js',
  './js/store.js',
  './js/search.js',
  './js/render.js',
  './js/router.js',
  './js/catalog.js',
  './js/collections.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-maskable.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .catch(() => caches.open(CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE && k !== PREVIEW_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // внешние ресурсы не кэшируем

  // навигация: сеть → кэш → офлайн-страница
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // скриншоты сайтов: отдельный кэш, грузим по требованию
  if (url.pathname.includes('/previews/')) {
    event.respondWith(
      caches.open(PREVIEW_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req)
            .then((res) => {
              if (res.status === 200 && res.type === 'basic') cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached || Response.error());
        })
      )
    );
    return;
  }

  // статика: кэш → сеть
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
