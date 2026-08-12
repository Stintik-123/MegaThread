const CACHE_NAME = 'megathread-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css?v=4',
  './js/app.js?v=4',
  './js/data.json?v=4',
  './js/data-more.json?v=4',
  './manifest.json'
];

// Установка Service Worker и кэширование
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Стратегия: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Игнорируем внешние запросы
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Кэшируем успешные GET-запросы
        if (event.request.method === 'GET' && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Если сети нет и кэша нет, возвращаем офлайн-страницу
        return caches.match('./index.html');
      });

      return cachedResponse || fetchPromise;
    })
  );
});
