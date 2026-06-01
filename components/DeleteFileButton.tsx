import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { BsX } from "react-icons/bs";

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
    className={cnWithReduceMotion(
      "absolute top-0 right-0 text-sm opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 outline-none",
      className,
    )}
    onClick={onClick}
    aria-label={label}
  >
    <BsX
      size={20}
      className={cnWithReduceMotion(
        "hover:opacity-50 focus-visible:opacity-50 transition-opacity",
      )}
      aria-hidden
    />
  </button>
);

export default DeleteFileButton;
