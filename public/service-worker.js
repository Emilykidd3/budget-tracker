const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "/index.html",
  "/css/styles.css",
  "/js/index.js",
  "/js/idb.js",
];

// Respond with cached resources
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  if (e.request.url.indexOf("/api/transaction") !== -1) {
    e.respondWith(
      caches.open(CACHE_NAME).then(function (request) {
        if (request.status === 200) {
          // if cache is available, respond with cache
          console.log("responding with cache : " + e.request.url);
          return request;
        } else {
          // if there are no cache, try fetching request
          console.log("file is not cached, fetching : " + e.request.url);
          return fetch(e.request);
        }

        // You can omit if/else for console.log & put one line below like this too.
        // return request || fetch(e.request)
      })
    );
  }
});

// Cache resources
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});
