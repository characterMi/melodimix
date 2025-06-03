import useInView from "@/hooks/useInView";
import type { Song } from "@/types/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getSongs } from "@/actions/getSongs";
import { twMerge } from "tailwind-merge";

interface Props {
  numOfSongs: number;
  setSongs: Dispatch<SetStateAction<Song[]>>;
}

const LIMIT = 10;

const LoadMore = ({ numOfSongs, setSongs }: Props) => {
  const offset = useRef(0);
  const retries = useRef(0);
  const retryTimeout = useRef<NodeJS.Timeout>();

  const [ref, isInView] = useInView<HTMLDivElement>();
  const [status, setStatus] = useState<
    "loadmore" | "error" | "retrying" | "ended"
  >(numOfSongs === LIMIT ? "loadmore" : "ended");

  useEffect(() => {
    if (!isInView || status !== "loadmore") return;

    offset.current += 1;

    getSongs(LIMIT, offset.current)
      .then((songs) => {
        if (songs.length < LIMIT) {
          setStatus("ended");
        }

        setSongs((prev) => [...prev, ...songs]);
      })
      .catch(() => {
        retries.current += 1;
        setStatus("retrying");
      });
  }, [isInView, status]);

  useEffect(() => {
    clearTimeout(retryTimeout.current);

    if (status === "retrying") {
      if (retries.current < 6) {
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
          Something went wrong, Retry in 5 seconds
        </Text>
      )}

      {status === "error" && <Text>Can't load more songs</Text>}

      {status === "ended" && offset.current !== 0 && <Text>No more songs</Text>}
    </div>
  );
};

const Text = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <p className={twMerge("text-neutral-500 text-center", className)}>
    {children}
  </p>
);

export default LoadMore;
