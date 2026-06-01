import { BsX } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

import { shouldReduceMotion } from "@/lib/reduceMotion";

const DeleteFileButton = ({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) => (
  <button
    className={twMerge(
      "absolute top-0 right-0 text-sm opacity-0 group-hover:opacity-100 focus-visible:opacity-100 outline-none",
      className,
      !shouldReduceMotion && "transition-opacity",
    )}
    onClick={onClick}
    aria-label={label}
  >
    <BsX
      size={20}
      className={twMerge(
        "hover:opacity-50 focus-visible:opacity-50",
        !shouldReduceMotion && "transition-opacity",
      )}
      aria-hidden
    />
  </button>
);

export default DeleteFileButton;
