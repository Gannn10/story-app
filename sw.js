const CACHE_NAME = 'story-app-v9'; // Naikkan versi
const BASE_URL = '/story-app'; 

const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('index.html'));
    })
  );
});

self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');
  async function chainPromise() {
    let data;
    try {
      // Coba parse sebagai JSON
      data = await event.data.json();
    } catch (error) {
      // Jika kiriman berupa teks plain (seperti 'Test push...'), buat objek manual
      data = {
        title: 'Story App Notification',
        options: {
          body: event.data ? event.data.text() : 'Ada update terbaru!',
        },
      };
    }

    await self.registration.showNotification(data.title || 'Story App', {
      body: data.options ? data.options.body : data.body,
      icon: 'favicon.svg',
    });
  }
  event.waitUntil(chainPromise());
});