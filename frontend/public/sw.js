// Service Worker for Edify PWA
const CACHE_NAME = 'edify-cache-v1';
const STATIC_CACHE_NAME = 'edify-static-v1';
const DYNAMIC_CACHE_NAME = 'edify-dynamic-v1';
const OFFLINE_URL = '/offline.html';

const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-splash.png',
  '/src/Pages/Images/logo.svg',
  '/src/index.css',
  '/src/main.jsx'
];

// Cache static assets during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => cache.addAll(staticAssets)),
      caches.open(CACHE_NAME),
      caches.open(DYNAMIC_CACHE_NAME)
    ])
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim clients to ensure the SW is activated correctly
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // API requests - Network first, fallback to cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets - Cache first, fallback to network
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((response) => {
              return response || caches.match(OFFLINE_URL);
            });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((fetchResponse) => {
              const clonedResponse = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
              return fetchResponse;
            });
        })
        .catch(() => {
          // Return default offline asset for images
          if (event.request.headers.get('accept').includes('image/')) {
            return caches.match('/icons/icon-192x192.png');
          }
        })
    );
  }
});
