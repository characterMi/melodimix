"use client";

import { useGetLikedSongs } from "@/hooks/useGetLikedSongs";
import { addPWAEventListeners } from "@/lib/addPWAEventListeners";
import { registerServiceWorker } from "@/lib/registerServiceWorker";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const IS_PWA =
  window.matchMedia("(display-mode: standalone)").matches ||
  // @ts-ignore
  window.navigator.standalone === true;

const Root = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const interval = useRef<NodeJS.Timeout>();

  useGetLikedSongs();

  useEffect(() => {
    registerServiceWorker();

    if (!IS_PWA) return;

    const removeListeners = addPWAEventListeners();

    return () => removeListeners();
  }, []);

  // Disable zooming...
  useEffect(() => {
    clearInterval(interval.current);

    if (IS_PWA) {
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
  }, [pathname]);

  return children;
};

export default Root;
