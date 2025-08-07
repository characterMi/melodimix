import { ComponentProps } from "react";
import { FaPlay } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<"div"> & { onClick: () => void };

const PlayButton = ({ onClick, className, ...props }: Props) => (
  <div
    className={twMerge(
      "rounded-full flex items-center justify-center bg-green-500 size-12 min-w-12 drop-shadow-md transition-opacity hover:opacity-50 focus-visible:opacity-50 outline-none",
      className
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
    <FaPlay className="text-black" />
  </div>
);

export default PlayButton;
