const CACHE_NAME = 'metcon-artist-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.png?v=3',
  './assets/icon-192.png?v=3',
  './favicon.ico?v=2',
  './_expo/static/js/web/index-148f60cf15c61c3c5cb3f2653639c873.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
