const CACHE_NAME = 'story-app-v8'; 
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

// EVENT PUSH SESUAI REKOMENDASI REVIEWER
self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');
  async function chainPromise() {
    const data = await event.data.json();
    await self.registration.showNotification(data.title, {
      body: data.options.body,
      icon: 'favicon.svg', // Pakai aset yang tersedia di public
    });
  }
  event.waitUntil(chainPromise());
});