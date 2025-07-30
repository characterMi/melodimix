import { RefObject, useEffect } from "react";

export const useFocusTrap = <T extends HTMLElement>(
  ref: RefObject<T>,
  isActive: boolean
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || !ref.current || e.key !== "Tab") return;

      const sidebarContainer = ref.current;

      const focusableElements = Array.from(
        sidebarContainer.querySelectorAll(
          [
            "a[href]",
            "button:not([disabled])",
            "textarea:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
          ].join(",")
        )
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (isActive) {
      ref.current?.addEventListener("keydown", handleKeyDown);
    } else {
      ref.current?.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      ref.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);
};
