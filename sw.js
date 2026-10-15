const CACHE_NAME = 'gumbel-v2';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json'
];

// Instalación: Almacenamiento de archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptación de red: Servir desde caché si se está offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna la versión en caché
        }
        return fetch(event.request); // Ejecuta petición de red si no está en caché
      })
  );
});
