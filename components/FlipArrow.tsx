import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { MdArrowOutward } from "react-icons/md";

const FlipArrow = ({
  label,
  hidden,
  onClick,
  role,
  size = 24,
}: {
  label?: string;
  hidden?: boolean;
  size?: number;
  role?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      aria-label={label}
      className={cnWithReduceMotion(
        "text-white overflow-hidden transition-opacity relative outline-none hover:opacity-50 focus-visible:opacity-50 cursor-pointer",
        `h-[${size}px]`,
      )}
      onClick={onClick}
      onKeyDown={
        !!onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClick();
              }
            }
          : undefined
      }
      tabIndex={!!onClick ? 0 : -1}
      role={role}
      aria-hidden={hidden}
    >
      <MdArrowOutward
        size={size}
        aria-hidden
        className={cnWithReduceMotion(
          "group-hover:-translate-y-full transition-transform group-focus-visible:-translate-y-full",
        )}
      />
      <MdArrowOutward
        size={size}
        aria-hidden
        className={cnWithReduceMotion(
          "absolute top-0 left-0 translate-y-full transition-transform w-full h-full group-hover:translate-y-0 group-focus-visible:translate-y-0",
        )}
      />
    </div>
  );
};

export default FlipArrow;
