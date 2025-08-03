"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { addPWAEventListeners } from "@/lib/addPWAEventListeners";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const PWABehaviorManager = () => {
  const pathname = usePathname();
  const interval = useRef<NodeJS.Timeout>();
  const isPWA =
    useMediaQuery("(display-mode: standalone)") ||
    /* @ts-ignore*/
    window.navigator.standalone === true;

  // PWA listeners...
  useEffect(() => {
    if (!isPWA) return;

    const removeListeners = addPWAEventListeners();

    return () => removeListeners();
  }, [isPWA]);

  // Disable zooming...
  useEffect(() => {
    clearInterval(interval.current);

    if (isPWA) {
      interval.current = setInterval(() => {
        const viewportMeta = document.querySelector<HTMLMetaElement>(
          'meta[name="viewport"]'
        );

        if (viewportMeta) {
          viewportMeta.setAttribute(
            "content",
            viewportMeta.content.replace(
              "user-scalable=yes",
              "user-scalable=no"
            )
          );

          clearInterval(interval.current);
        }
      }, 10);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [pathname, isPWA]);

  return null;
};

export default PWABehaviorManager;
