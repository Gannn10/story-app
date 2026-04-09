// sw.js
const CACHE_NAME = 'story-app-v5'; 
const BASE_URL = '/story-app'; 

const ASSETS_TO_CACHE = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/manifest.json`,
  `${BASE_URL}/src/styles/style.css`,
  `${BASE_URL}/src/index.js`,
  `${BASE_URL}/src/routes/router.js`,
  `${BASE_URL}/icons/icon-192x192.png`,
  `${BASE_URL}/icons/icon-512x512.png`,
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
      // Strategi: Cache First, Fallback ke index.html jika offline untuk cegah "Dino"
      return response || fetch(event.request).catch(() => caches.match(`${BASE_URL}/index.html`));
    })
  );
});

// PUSH NOTIFICATION EVENT
self.addEventListener('push', (event) => {
  let data = { title: 'Story App', body: 'Ada update terbaru!', url: `${BASE_URL}/#/` };
  try {
    data = event.data.json();
  } catch (e) {}

  const options = {
    body: data.body,
    icon: `${BASE_URL}/icons/icon-192x192.png`,
    badge: `${BASE_URL}/icons/icon-192x192.png`,
    data: { url: data.url.startsWith('http') ? data.url : `${BASE_URL}${data.url}` }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});