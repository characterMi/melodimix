import { twMerge } from "tailwind-merge";

const Spinner = ({ size = "large" }: { size?: "small" | "large" }) => {
  const blades = Array.from({ length: 12 });

  return (
    <div
      className={twMerge(
        "w-[20px] h-[20px] relative inline-block",
        size === "small" && "w-[16px] h-[16px]"
      )}
    >
      {blades.map((_, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute left-[8px] bottom-0 h-[5px] rounded-[1px] bg-neutral-100 animate-spinner"
          style={{
            width: size === "small" ? "1px" : "2px",
            transform: `rotate(${i * 30}deg)`,
            transformOrigin: `center -${size === "small" ? 2 : 4}px`,
            animationDelay: `${(i * 1) / 12}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Spinner;
