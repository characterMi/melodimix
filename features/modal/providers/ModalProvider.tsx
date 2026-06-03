"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/features/auth/components/AuthModal";
import DownloadedSongsModal from "@/features/cache/components/DownloadedSongsModal";
import ManageCacheModal from "@/features/cache/components/ManageCacheModal";
import PlaylistDetailsModal from "@/features/playlist/components/PlaylistDetailsModal";
import PlaylistModal from "@/features/playlist/components/PlaylistModal";
import SettingsModal from "@/features/settings/components/SettingsModal";
import UploadModal from "@/features/upload-song/components/UploadModal";
import UserModal from "@/features/user-related/components/UserModal";

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
      <DownloadedSongsModal />
      <PlaylistModal />
      <PlaylistDetailsModal />
      <UserModal />
    </>
  );
};
