import { MdArrowOutward } from "react-icons/md";
import { twMerge } from "tailwind-merge";

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
      className={twMerge(
        "text-white overflow-hidden relative outline-none transition-opacity hover:opacity-50 focus-visible:opacity-50 cursor-pointer",
        `h-[${size}px]`
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
        className="group-hover:-translate-y-full group-focus-visible:-translate-y-full transition-transform"
      />
      <MdArrowOutward
        size={size}
        aria-hidden
        className="absolute top-0 left-0 translate-y-full w-full h-full group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform"
      />
    </div>
  );
};

export default FlipArrow;
