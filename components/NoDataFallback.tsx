"use client";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { useRouter } from "next/navigation";
import { RxReload } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  showButton?: boolean;
  fallbackText?: string;
};

const NoDataFallBack = ({
  className,
  showButton = true,
  fallbackText = "No song available.",
}: Props) => {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        "flex gap-x-2 items-center text-neutral-400 mt-4",
        className,
      )}
    >
      <p>{fallbackText}</p>
      {showButton && (
        <button
          className={cnWithReduceMotion(
            "flex items-center gap-x-1 transition-colors underline outline-none hover:text-white focus-visible:text-white",
          )}
          onClick={() => router.refresh()}
        >
          Refresh
          <RxReload aria-hidden />
        </button>
      )}
    </div>
  );
};

export default NoDataFallBack;
