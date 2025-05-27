const CACHE_NAME = "lab02-cache-v1";
const urlsToCache = [
  "/students.html",
  "/pages/dashboard.html",
  "/pages/messages.html",
  "/pages/tasks.html",
  "/styles/body-header-style.css",
  "/styles/form-style.css",
  "/styles/messages-style.css",
  "/styles/sidemenu-style.css",
  "/styles/table-style.css",
  "/scripts/animation-script.js",
  "/scripts/pagination-script.js",
  "/scripts/sidemenu-script.js",
  "/scripts/table-functionality.js",
  "/icons/avataranonimus.png"
];


self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urlsToCache);
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

