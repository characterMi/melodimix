"use client";

import AuthModal from "@/components/AuthModal";
import ManageCacheModal from "@/components/ManageCacheModal";
import {
  CreatePlaylistModal,
  UpdatePlaylistModal,
} from "@/components/PlaylistModal";
import UploadModal from "@/components/UploadModal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AuthModal />
      <UploadModal />
      <ManageCacheModal />
      <CreatePlaylistModal />
      <UpdatePlaylistModal />
    </>
  );
};
