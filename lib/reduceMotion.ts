import { getItemFromLocalStorage } from "@/lib/getItemFromLocalStorage";

export const shouldReduceMotion = (() => {
  const storedValue = getItemFromLocalStorage(
    "reduce-motion",
    ["true", "false"],
    "false"
  );

  if (storedValue === "true") return true;

  if (typeof window !== "undefined" && "matchMedia" in window) {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  return false;
})();
