const assets = ["/", "/logo.svg", "/images/liked.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("melodi-mix").then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Even if the response is in the cache, we fetch it
      // and update the cache for future usage
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          return caches.open("melodi-mix").then((cache) => {
            cache.put(event.request.url, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch((e) => {
          console.error(e);

          return new Response(
            "Network error and no cached data available. see the browser's console for more information",
            {
              status: 503,
              statusText: "Service Unavailable.",
            }
          );
        });
      // We use the currently cached version if it's there
      return response || fetchPromise; // cached or a network fetch
    })
  );
});
