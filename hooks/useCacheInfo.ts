import { formatBytes } from "@/lib/formatBytes";
import { formatPercentage } from "@/lib/formatPercentage";
import type { CacheData, CacheKeys } from "@/types/types";

export const useCacheInfo = (totalCacheSize: number, cacheData: CacheData) => {
  const cacheNames = Object.keys(cacheData) as CacheKeys[];
  const totalCacheSizeFormatted = formatBytes(totalCacheSize, 0).split(" ");

  const cacheColors: Record<CacheKeys, string> = {
    assets: "#34d399",
    songs: "#4216b8",
    "songs-data": "#065f46",
  };

  const cachePercentages = {} as Record<CacheKeys, number>;
  const cacheSizesFormatted = {} as Record<CacheKeys, string>;

  cacheNames.forEach((name) => {
    const size = cacheData[name];
    cachePercentages[name] = formatPercentage(size, totalCacheSize);
    cacheSizesFormatted[name] = formatBytes(size);
  });

  function conicGradient() {
    let gradientString = "from 0deg at 50% 50%, ";
    let startAngle = 0;

    const segments = cacheNames.map((name) => {
      const endAngle = startAngle + cachePercentages[name];
      const segment = `${cacheColors[name]} ${startAngle.toFixed(
        1
      )}% ${endAngle.toFixed(1)}%`;
      startAngle = endAngle;
      return segment;
    });

    return gradientString + segments.join(", ");
  }

  return {
    title: totalCacheSizeFormatted as [string, string],
    cacheColors,
    cachePercentages,
    cacheSizesFormatted,
    conicGradient,
    cacheNames,
  };
};
