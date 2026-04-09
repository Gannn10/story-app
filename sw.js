// sw.js (Pastikan file ini ada di folder public/)
const CACHE_NAME = 'story-app-v6'; 
const BASE_URL = '/story-app'; 

const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
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
      // Offline fallback ke index.html agar tidak muncul Dino
      return response || fetch(event.request).catch(() => caches.match('index.html'));
    })
  );
});