import { getItemFromLocalStorage } from "@/lib/getItemFromLocalStorage";
import { ClassNameValue, twMerge } from "tailwind-merge";

export const shouldReduceMotion = (() => {
  const storedValue = getItemFromLocalStorage(
    "reduce-motion",
    ["true", "false"],
    "false",
  );

  if (storedValue === "true") return true;

  if (typeof window !== "undefined" && "matchMedia" in window) {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  return false;
})();

export const cnWithReduceMotion = (...classes: ClassNameValue[]) => {
  return twMerge(
    ...classes,
    shouldReduceMotion && "transition-none delay-0 duration-0 animate-none",
  );
};
