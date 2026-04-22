import useInView from "@/hooks/useInView";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  initialStatus: "loadmore" | "ended";
  currentPage: number;
  setData: (songs: any[], page: number) => void;
  getDataPromise: (limit: number, offset: number) => Promise<any[]>;
  numberOfRetries?: number;
  limit?: number;
}

const LoadMore = ({
  initialStatus,
  currentPage,
  setData,
  getDataPromise,
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
    if (isLoading || !isInView || status !== "loadmore") return;

    setIsLoading(true);

    getDataPromise(limit, currentPage)
      .then((data) => {
        if (data.length < limit) {
          setStatus("ended");
        }

        setData(data, currentPage + 1);
      })
      .catch(() => {
        setStatus("retrying");
        retries.current += 1;
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500);
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

  return (
    <div className="flex justify-center items-center py-8 relative">
      {(status === "loadmore" || status === "retrying") && (
        <div
          ref={ref}
          className={twMerge(status === "retrying" && "opacity-0")}
        >
          <Text>Loading more...</Text>
        </div>
      )}

      {status === "retrying" && (
        <Text className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Something went wrong, Retry in{" "}
          <span aria-label="5" className="retry-animation" /> seconds
        </Text>
      )}

      {status === "error" && <Text>Couldn't load more data</Text>}

      {status === "ended" && currentPage !== 0 && <Text>No more data</Text>}
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
