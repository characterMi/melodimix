"use client";

import { useGetLikedSongs } from "@/hooks/useGetLikedSongs";
import { registerServiceWorker } from "@/lib/registerServiceWorker";
import { useEffect } from "react";

const Root = ({ children }: { children: React.ReactNode }) => {
  useGetLikedSongs();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return children;
};

export default Root;
