const CACHE_NAME = 'metcon-artist-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.png?v=2',
  './assets/icon-192.png?v=2',
  './favicon.ico?v=2',
  './_expo/static/js/web/index-7c99d92a0b8728849ece7306227165b7.js'
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
