import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  variant?: "primary" | "secondary" | "error";
} & ComponentProps<"button">;

const variantClasses = {
  primary: "from-emerald-700 to-emerald-800 border-emerald-600",
  secondary: "from-sky-700 to-sky-800 border-sky-600",
  error: "from-red-700 to-red-800 border-red-600",
};

const VariantButton = ({
  variant = "primary",
  children,
  className,
  ...props
}: Props) => {
  return (
    <button
      className={twMerge(
        "cursor-pointer size-6 bg-gradient-to-b border rounded-sm flex items-center justify-center hover:opacity-50 focus-visible:opacity-50 outline-none transition",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default VariantButton;
