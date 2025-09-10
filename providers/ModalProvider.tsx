"use client";

import AuthModal from "@/components/AuthModal";
import ManageCacheModal from "@/components/ManageCacheModal";
import PlaylistModal from "@/components/PlaylistModal";
import SettingsModal from "@/components/SettingsModal";
import UploadModal from "@/components/UploadModal";
import UserModal from "@/components/UserModal";
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
      <SettingsModal />
      <ManageCacheModal />
      <PlaylistModal />
      <UserModal />
    </>
  );
};
