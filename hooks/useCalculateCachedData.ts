import { CacheData } from "@/types";
import { useEffect, useState } from "react";

export const useCalculateCachedData = () => {
  const [cacheData, setCacheData] = useState<CacheData>({
    assets: 0,
    songs: 0,
    "songs-data": 0,
  });

  const [status, setStatus] = useState<"loading" | "error" | "loaded">(
    "loading"
  );

  useEffect(() => {
    const worker = new Worker("/cacheWorker.js");

    worker.postMessage("Calculating storage usage...");

    worker.onmessage = (event) => {
      setCacheData(event.data);
      setStatus("loaded");
      worker.terminate();
    };

    worker.onerror = () => {
      setStatus("error");
      worker.terminate();
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const totalCacheSize = Object.values(cacheData).reduce(
    (prev, curr) => prev + curr,
    0
  );

  return {
    cacheData,
    totalCacheSize,
    status,
  };
};
