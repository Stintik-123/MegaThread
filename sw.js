const CACHE = 'megathread-v12';
const PREVIEW_CACHE = 'megathread-previews-v2';

// Все модули и стили, от которых зависит интерактивный каталог.
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
  './js/groups.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Не используем addAll: одна 404/сетевая ошибка валит весь precache.
      await Promise.allSettled(
        ASSETS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res.ok) await cache.put(url, res);
          } catch (_) {
            /* пропускаем — сеть подхватит при первом запросе */
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE && k !== PREVIEW_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Навигация: сеть → кэш
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() =>
          caches.match('./index.html').then((r) => r || caches.match('./'))
        )
    );
    return;
  }

  // Скриншоты — отдельный кэш. Network-first: картинки переснимаются, и старый
  // кадр не должен висеть в офлайне вечно.
  if (url.pathname.includes('/previews/')) {
    event.respondWith(
      caches.open(PREVIEW_CACHE).then(async (cache) => {
        try {
          const res = await fetch(req);
          if (res.ok && res.type === 'basic') cache.put(req, res.clone());
          return res;
        } catch {
          const cached = await cache.match(req);
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // JS и CSS — network-first, чтобы обновления не залипали в старом кэше.
  // Именно это чинит «работает только после Ctrl+Shift+R».
  const isCode =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json');

  if (isCode) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Остальная статика: кэш → сеть
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
