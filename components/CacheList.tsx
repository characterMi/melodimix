import { useCacheList } from "@/hooks/useCacheList";
import { formatBytes } from "@/lib/formatBytes";
import type { CacheData, CacheKeys } from "@/types/types";
import { Fragment } from "react";
import { CheckmarkIcon } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import Button from "./Button";

type Props = {
  cacheColors: Record<CacheKeys, string>;
  cachePercentages: Record<CacheKeys, number>;
  cacheSizesFormatted: Record<CacheKeys, string>;
  cacheNames: CacheKeys[];
  cacheData: CacheData;
};

const CacheList = ({
  cacheColors,
  cachePercentages,
  cacheSizesFormatted,
  cacheNames,
  cacheData,
}: Props) => {
  const {
    handleClearCache,
    handleClickOnCacheItem,
    selectedCaches,
    selectedCacheSize,
  } = useCacheList(cacheNames, cacheData);

  return (
    <>
      <div className="w-full flex flex-col gap-4 bg-neutral-900/50 p-4 rounded-md">
        {cacheNames.map((item, i) => {
          const isSelected = selectedCaches.includes(item);
          const color = cacheColors[item];

          return (
            <Fragment key={item}>
              {i !== 0 && <hr className="border-none h-[1px] bg-neutral-600" />}

              <div className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleClickOnCacheItem(item, isSelected)}
                    aria-label="Select the cache"
                  >
                    <CheckmarkIcon
                      style={{
                        background: isSelected ? color : "transparent",
                        transition: "50ms background ease-in",
                        animationDelay: i * 0.1 + "s",
                        border: `1px solid ${color}`,
                      }}
                      className={twMerge(
                        "after:!bottom-1 after:!transition-[border] after:!duration-[50ms]",
                        isSelected
                          ? "after:!border-white"
                          : "after:!border-transparent"
                      )}
                    />
                  </button>
                  <p className="capitalize font-thin">{item}</p>
                  <span className="text-xs opacity-50">
                    {cachePercentages[item]}%
                  </span>
                </div>

                <p
                  className="text-sm opacity-80 transition-opacity group-hover:opacity-100 underline"
                  style={{ textDecorationColor: color }}
                >
                  {cacheSizesFormatted[item]}
                </p>
              </div>
            </Fragment>
          );
        })}
      </div>

      <Button
        disabled={selectedCacheSize === 0}
        className="disabled:cursor-not-allowed"
        onClick={handleClearCache}
      >
        {selectedCacheSize === 0 ? (
          "Nothing to clear"
        ) : (
          <>
            Clear the cache
            <span className="ml-2 text-sm opacity-50 font-black">
              {formatBytes(selectedCacheSize)}
            </span>
          </>
        )}
      </Button>
    </>
  );
};

export default CacheList;
