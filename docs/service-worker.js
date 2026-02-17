// CalmaComida Service Worker FINAL FIX
const CACHE_NAME = "calmacomida-v300";

// Solo archivos realmente estáticos
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.json",
  "./favicon.ico"
];

// instalación
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// activación
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// CLAVE: estrategia network-first
self.addEventListener("fetch", event => {
  const request = event.request;

  // SOLO manejamos peticiones de nuestra web
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then(response => {
        // guardamos copia nueva
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(request))
  );
});
