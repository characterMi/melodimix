import { Root, type SwitchProps, Thumb } from "@radix-ui/react-switch";
import { twMerge } from "tailwind-merge";

import { shouldReduceMotion } from "@/lib/reduceMotion";

import type { RefAttributes } from "react";

const Switch = ({
  size = "md",
  ...props
}: SwitchProps & RefAttributes<HTMLButtonElement> & { size?: "sm" | "md" }) => {
  return (
    <Root
      className={twMerge(
        "relative rounded-full bg-white shadow-none outline-none focus:shadow-[0_0_0_2px] focus:shadow-emerald-400 data-[state=checked]:bg-emerald-400",
        !shouldReduceMotion && "transition-shadow duration-100",
        size === "md" ? "h-[16px] w-[32px]" : "h-[12px] w-[24px]",
      )}
      {...props}
    >
      <Thumb
        className={twMerge(
          "block rounded-full bg-black will-change-transform translate-x-[2px]",
          !shouldReduceMotion && "transition-transform duration-100",
          size === "md"
            ? "size-[12px] data-[state=checked]:translate-x-[18px]"
            : "size-[10px] data-[state=checked]:translate-x-[12px]",
        )}
      />
    </Root>
  );
};

export default Switch;
