import type { Playlist } from "@/types";
import { create } from "zustand";

interface PlaylistModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreatePlaylistModal = create<PlaylistModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useUpdatePlaylistModal = create<
  Omit<PlaylistModalStore, "onOpen"> & {
    initialData: Playlist;
    onOpen: (data: Playlist) => void;
  }
>((set) => ({
  isOpen: false,
  initialData: {} as Playlist,
  onOpen: (data: Playlist) => set({ isOpen: true, initialData: data }),
  onClose: () => set({ isOpen: false }),
}));
