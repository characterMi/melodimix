import { useCallback, useEffect, useState } from "react";

export const useGetDownloadedSongs = () => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );
  const [rawUrls, setRawUrls] = useState<string[]>([]);

  const deleteSong = useCallback((song: string) => {
    setRawUrls((prev) => prev.filter((item) => item !== song));
  }, []);

  useEffect(() => {
    (async () => {
      setStatus("loading");

      try {
        const cache = await caches.open("songs");
        const keys = await cache.keys();

        setRawUrls(keys.map((key) => key.url));
        setStatus("loaded");
      } catch {
        setStatus("error");
      }
    })();
  }, []);

  return { status, rawUrls, deleteSong };
};
