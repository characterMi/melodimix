import { useCacheInfo } from "@/hooks/useCacheInfo";
import type { CacheData } from "@/types/types";
import CacheList from "./CacheList";

type Props = {
  totalCacheSize: number;
  cacheData: CacheData;
};

const CacheInfo = ({ totalCacheSize, cacheData }: Props) => {
  const {
    cacheColors,
    cachePercentages,
    cacheSizesFormatted,
    cacheNames,
    title,
    conicGradient,
  } = useCacheInfo(totalCacheSize, cacheData);

  return (
    <div className="space-y-6 w-full">
      <div
        style={{
          backgroundImage: `conic-gradient(${conicGradient()})`,
        }}
        className="size-48 rounded-full flex items-center justify-center p-8 mx-auto"
      >
        <div className="bg-neutral-800 size-full rounded-full flex items-center justify-center gap-1 flex-col">
          <p className="text-4xl font-bold text-white">{title[0]}</p>
          <span className="opacity-75">{title[1]}</span>
        </div>
      </div>

      <CacheList
        cacheColors={cacheColors}
        cachePercentages={cachePercentages}
        cacheSizesFormatted={cacheSizesFormatted}
        cacheData={cacheData}
        cacheNames={cacheNames}
      />
    </div>
  );
};

export default CacheInfo;
