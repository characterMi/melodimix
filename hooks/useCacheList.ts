import { useManageCacheModal } from "@/store/useManageCacheModal";
import type { CacheData, CacheKeys } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

const VERSION = "1.1.1";

export const useCacheList = (cacheNames: CacheKeys[], cacheData: CacheData) => {
  const closeModal = useManageCacheModal((state) => state.onClose);
  const [selectedCaches, setSelectedCaches] = useState(cacheNames);

  const selectedCacheSize = selectedCaches.reduce(
    (sum, cacheName) => sum + cacheData[cacheName],
    0
  );

  function handleClickOnCacheItem(
    cacheName: CacheKeys,
    isCurrentItemSelected: boolean
  ) {
    if (isCurrentItemSelected) {
      setSelectedCaches((prev) => prev.filter((item) => item !== cacheName));
    } else {
      setSelectedCaches((prev) => [...prev, cacheName]);
    }
  }

  async function handleClearCache() {
    if (selectedCacheSize === 0) return;

    try {
      await Promise.allSettled(
        selectedCaches.map((name) =>
          caches.delete(name === "assets" ? name + VERSION : name)
        )
      );
      toast.success("Cache cleared successfully.");
      closeModal();
    } catch (error) {
      toast.error("Something went wrong while clearing the cache.");
    }
  }

  return {
    selectedCaches,
    selectedCacheSize,
    handleClearCache,
    handleClickOnCacheItem,
  };
};
