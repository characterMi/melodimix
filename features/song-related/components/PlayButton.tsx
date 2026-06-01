import { FaPlay } from "react-icons/fa";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";

import type { ComponentProps } from "react";

type Props = ComponentProps<"div"> & { onClick: () => void };

const PlayButton = ({ onClick, className, children, ...props }: Props) => (
  <div
    className={cnWithReduceMotion(
      "rounded-full flex transition-transform items-center justify-center bg-green-500 size-12 min-w-12 drop-shadow-md hover:scale-105 focus-visible:scale-105 outline-none",
      className,
    )}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();

      onClick();
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();

        onClick();
      }
    }}
    tabIndex={0}
    role="button"
    {...props}
  >
    {children || <FaPlay className="text-black" />}
  </div>
);

export default PlayButton;
