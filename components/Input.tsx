import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type, disabled, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={twMerge(
        "flex w-full rounded-sm bg-neutral-700 bg-transparent p-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none",
        className
      )}
      disabled={disabled}
      {...props}
    />
  )
);
export default Input;
