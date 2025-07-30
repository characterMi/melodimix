"use client";

import { useGetLikedSongs } from "@/hooks/useGetLikedSongs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { addPWAEventListeners } from "@/lib/addPWAEventListeners";
import { registerServiceWorker } from "@/lib/registerServiceWorker";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const Root = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const interval = useRef<NodeJS.Timeout>();
  const isPWA = useMediaQuery("(display-mode: standalone)");

  useGetLikedSongs();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    /* @ts-ignore*/
    if (!isPWA || window.navigator.standalone === true) return;

    const removeListeners = addPWAEventListeners();

    return () => removeListeners();
  }, [isPWA]);

  // Disable zooming...
  useEffect(() => {
    clearInterval(interval.current);

    /* @ts-ignore*/
    if (isPWA || window.navigator.standalone === true) {
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

  return children;
};

export default Root;
