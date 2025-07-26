"use client";

import { useGetLikedSongs } from "@/hooks/useGetLikedSongs";
import { registerServiceWorker } from "@/lib/registerServiceWorker";
import { useEffect } from "react";

const Root = ({ children }: { children: React.ReactNode }) => {
  useGetLikedSongs();

  useEffect(() => {
    registerServiceWorker();
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true;

    if (!isPWA) return;

    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventGesture = (e: Event) => e.preventDefault();
    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };

    window.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("gesturestart", preventGesture);
    document.addEventListener("gesturechange", preventGesture);
    window.addEventListener("wheel", preventWheelZoom, { passive: false });

    return () => {
      window.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      window.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

  return children;
};

export default Root;
