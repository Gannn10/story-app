const CACHE_NAME = 'story-app-v3';

// 1. Daftar Aset Statis (App Shell)
// Pastikan path ini SAMA PERSIS dengan yang ada di index.html kamu
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles/style.css',
  '/src/index.js',
  '/src/scripts/routes/router.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/screenshots/desktop.png',
  '/screenshots/mobile.png',
  // Cache Library External (Leaflet) agar peta tidak hancur pas offline
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// INSTALL: Simpan semua aset ke Cache Storage
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVATE: Hapus cache lama jika ada update versi
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// FETCH: Strategi Caching (KRITERIA 3 ADVANCED)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategi A: Khusus API Stories (Network First)
  // Ambil dari internet dulu, kalau gagal (offline) ambil dari cache
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
    // Ambil dari cache dulu (biar cepet), tapi tetep update cache di background
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

// PUSH NOTIFICATION (KRITERIA 2 SKILLED & ADVANCED)
self.addEventListener('push', (event) => {
  console.log('Push Notification Received');
  
  let data = { title: 'Story App', body: 'Ada update terbaru!', url: '/#/' };
  try {
    data = event.data.json();
  } catch (e) {
    console.log('Push data is not JSON, using default');
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url // Untuk navigasi saat diklik
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// NOTIFICATION CLICK: Navigasi ke Halaman Tertentu (KRITERIA 2 ADVANCED)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const urlToOpen = event.notification.data.url;
      
      // Jika tab sudah terbuka, fokuskan. Jika tidak, buka tab baru.
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});