const CACHE_NAME = 'story-app-v3';
const BASE_URL = '/story-app'; // Sesuai nama repo kamu

// 1. Daftar Aset Statis dengan Prefix Base URL
const ASSETS_TO_CACHE = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/manifest.json`,
  `${BASE_URL}/src/styles/style.css`,
  `${BASE_URL}/src/index.js`,
  `${BASE_URL}/src/routes/router.js`,
  // Sesuaikan path icon sesuai folder public kamu
  `${BASE_URL}/icons/icon-192x192.png`,
  `${BASE_URL}/icons/icon-512x512.png`,
  `${BASE_URL}/screenshots/desktop.png`,
  `${BASE_URL}/screenshots/mobile.png`,
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== 'api-cache') {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategi A: API Stories (Network First)
  if (url.origin === 'https://story-api.dicoding.dev') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open('api-cache').then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Strategi B: Aset Statis (Stale-While-Revalidate)
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});

// PUSH NOTIFICATION
self.addEventListener('push', (event) => {
  let data = { title: 'Story App', body: 'Ada update terbaru!', url: `${BASE_URL}/#/` };
  try {
    data = event.data.json();
  } catch (e) {
    // default data
  }

  const options = {
    body: data.body,
    icon: `${BASE_URL}/icons/icon-192x192.png`,
    badge: `${BASE_URL}/icons/icon-192x192.png`,
    vibrate: [100, 50, 100],
    data: { url: data.url.startsWith('http') ? data.url : `${BASE_URL}${data.url}` }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const urlToOpen = event.notification.data.url;
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});