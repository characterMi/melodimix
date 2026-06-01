"use client";

import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { forwardRef } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, className, disabled, type, ...props }, ref) => {
    return (
      <button
        type={type}
        className={cnWithReduceMotion(
          "w-full rounded-full bg-gradient-to-r from-green-500 to-green-600 border border-transparent p-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-50 focus-visible:opacity-50 transition-opacity outline-none",
          className,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
