const assets = [
  "/",
  "/manifest.webmanifest",
  "/search",
  "/logo.svg",
  "/images/liked.png",
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/d1.png",
  "/images/d2.png",
  "/images/d3.png",
  "/icons/liked-192.png",
  "/icons/melodimix-192.png",
  "/icons/melodimix-192-maskable.png",
  "/icons/melodimix-512.png",
  "/icons/melodimix-512-maskable.png",
];

const APP_URL = "localhost:3000";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("assets").then((cache) => {
      cache.addAll(assets);
    })
  );

  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const eventUrl = new URL(event.request.url);

  // only caching songs or static assets...
  if (
    (eventUrl.hostname === "ibmcmrwzbejntporrerq.supabase.co" &&
      (eventUrl.pathname.startsWith("/rest/v1/songs") ||
        eventUrl.pathname.startsWith("/storage/v1/object/public/songs"))) ||
    (eventUrl.host === APP_URL && assets.includes(eventUrl.pathname))
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) return response;

        const cacheName = getCacheName(eventUrl);
        console.log(cacheName);

        return fetch(event.request)
          .then((networkResponse) => {
            return caches.open(cacheName).then((cache) => {
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
      })
    );
  } else event.respondWith(fetch(event.request));
});

function getCacheName(eventUrl) {
  if (eventUrl.host === APP_URL && assets.includes(eventUrl.pathname)) {
    return "assets";
  }

  if (eventUrl.hostname === "ibmcmrwzbejntporrerq.supabase.co") {
    if (eventUrl.pathname.startsWith("/rest/v1/songs")) return "song-urls";

    return "songs";
  }
}
