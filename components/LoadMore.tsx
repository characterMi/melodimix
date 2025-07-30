import useInView from "@/hooks/useInView";
import type { Song } from "@/types";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  initialStatus: "loadmore" | "ended";
  currentPage: number;
  setSongs: (songs: Song[], page: number) => void;
  getSongsPromise: (limit: number, offset: number) => Promise<Song[]>;
  numberOfRetries?: number;
  limit?: number;
}

const LoadMore = ({
  initialStatus,
  currentPage,
  setSongs,
  getSongsPromise,
  numberOfRetries = 5,
  limit = 10,
}: Props) => {
  const retries = useRef(0);
  const retryTimeout = useRef<NodeJS.Timeout>();

  const [ref, isInView] = useInView<HTMLDivElement>();
  const [status, setStatus] = useState<
    "loadmore" | "error" | "retrying" | "ended"
  >(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isInView || status !== "loadmore" || isLoading) return;

    setIsLoading(true);

    getSongsPromise(limit, currentPage)
      .then((songs) => {
        if (songs.length < limit) {
          setStatus("ended");
        }

        setSongs(songs, currentPage + 1);
      })
      .catch(() => {
        setStatus("retrying");
        retries.current += 1;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isInView, status, isLoading]);

  useEffect(() => {
    clearTimeout(retryTimeout.current);

    if (status === "retrying") {
      if (retries.current < numberOfRetries) {
        retryTimeout.current = setTimeout(() => {
          setStatus("loadmore");
        }, 5000);
      } else {
        setStatus("error");
      }
    }

    return () => {
      clearTimeout(retryTimeout.current);
    };
  }, [status]);

  // this means we didn't hit the LIMIT, so we don't have to load any song
  if (status === "ended" && currentPage === 0) return null;

  return (
    <div className="flex justify-center items-center py-8 relative">
      {(status === "loadmore" || status === "retrying") && (
        <div
          ref={ref}
          className={twMerge(status === "retrying" && "opacity-0")}
        >
          <Text>Loading more songs...</Text>
        </div>
      )}

      {status === "retrying" && (
        <Text className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Something went wrong, Retry in{" "}
          <span aria-label="5" className="retry-animation" /> seconds
        </Text>
      )}

      {status === "error" && <Text>Can't load more songs</Text>}

      {status === "ended" && <Text>No more songs</Text>}
    </div>
  );
};

const Text = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={twMerge("text-neutral-500 text-center", className)}>
    {children}
  </p>
);

export default LoadMore;
