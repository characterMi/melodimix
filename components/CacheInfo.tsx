import { useCacheInfo } from "@/hooks/useCacheInfo";
import type { CacheData, CacheKeys } from "@/types/types";
import { Fragment } from "react";
import { CheckmarkIcon } from "react-hot-toast";
import Button from "./Button";

type Props = {
  totalCacheSize: number;
  cacheData: CacheData;
};

const CacheInfo = ({ totalCacheSize, cacheData }: Props) => {
  const {
    cacheColors,
    cachePercentages,
    cacheSizesFormatted,
    title,
    conicGradient,
    handleClearCache,
  } = useCacheInfo(totalCacheSize, cacheData);

  return (
    <div className="space-y-6 w-full">
      <div
        style={{
          backgroundImage: `conic-gradient(${conicGradient()})`,
        }}
        className="size-48 rounded-full flex items-center justify-center p-10 mx-auto"
      >
        <div className="bg-neutral-800 size-full rounded-full flex items-center justify-center gap-1 flex-col">
          <p className="text-4xl font-bold text-white">{title[0]}</p>
          <span className="opacity-75">{title[1]}</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 bg-neutral-900/50 p-4 rounded-md">
        {(["assets", "song-urls", "songs"] as CacheKeys[]).map((item, i) => (
          <Fragment key={item}>
            {i !== 0 && <hr className="border-none h-[1px] bg-neutral-600" />}

            <div className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <CheckmarkIcon
                  style={{
                    background: cacheColors[item],
                    animationDelay: i * 0.1 + "s",
                  }}
                />
                <p className="capitalize font-thin">{item}</p>
                <span className="text-xs opacity-50">
                  {cachePercentages[item]}%
                </span>
              </div>

              <p
                className="text-sm opacity-80 transition-opacity group-hover:opacity-100 underline"
                style={{ textDecorationColor: cacheColors[item] }}
              >
                {cacheSizesFormatted[item]}
              </p>
            </div>
          </Fragment>
        ))}
      </div>

      <Button
        disabled={totalCacheSize === 0}
        className="disabled:cursor-not-allowed"
        onClick={handleClearCache}
      >
        {totalCacheSize === 0 ? "Nothing to clear" : "Clear the cache"}
      </Button>
    </div>
  );
};

export default CacheInfo;
