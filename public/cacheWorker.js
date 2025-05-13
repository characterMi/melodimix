const VERSION = "1.0.0";

async function estimateCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();

  const sizePromises = requests.map(async (request) => {
    const response = await cache.match(request);
    if (!response || !response.body) return 0;

    const buffer = await response.clone().arrayBuffer();
    return buffer.byteLength;
  });

  const sizes = await Promise.all(sizePromises);
  return sizes.reduce((sum, size) => sum + size, 0);
}

self.onmessage = async function () {
  const sizeEntries = await Promise.all(
    ["assets" + VERSION, "songs", "song-urls"].map(async (cacheName) => {
      const size = await estimateCacheSize(cacheName);

      // we don't want to set the key as for example "assets1.0.0", instead we set the key as just "assets"
      if (cacheName === "assets" + VERSION) {
        return ["assets", size];
      }

      return [cacheName, size];
    })
  );

  self.postMessage(Object.fromEntries(sizeEntries));
};
