// CalmaComida Service Worker FINAL FIX
const CACHE_NAME = 'calmacomida-v3';
// Solo archivos realmente estáticos
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js" ,
  "./app.js"  ,
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
  if (new URL(request.url).origin !== self.location.origin) return;

  // Los audios se piden por trozos (Range) y no se pueden guardar en caché así
  if (request.headers.has("range")) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        // guardamos copia nueva (solo respuestas completas y correctas)
        if (response.ok && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
