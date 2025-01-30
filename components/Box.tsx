"use client";

import { usePlayer } from "@/store/usePlayerStore";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  isLibrary?: boolean;
}

const Box: FC<BoxProps> = ({ children, className, isLibrary }) => {
  const activeId = usePlayer((state) => state.activeId);

  return (
    <div
      className={twMerge(
        "bg-neutral-900 rounded-lg h-fit w-full",
        className,
        activeId && isLibrary && "mb-28"
      )}
    >
      {children}
    </div>
  );
};

export default Box;
