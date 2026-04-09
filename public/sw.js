const CACHE_NAME = 'story-app-v7'; 
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
      // Fallback ke index.html jika offline untuk mencegah "Dino"
      return response || fetch(event.request).catch(() => caches.match('index.html'));
    })
  );
});