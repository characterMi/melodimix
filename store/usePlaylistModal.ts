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
  PlaylistModalStore & {
    initialData: Playlist;
    setInitialData: (playlistData: Playlist) => void;
  }
>((set) => ({
  isOpen: false,
  initialData: {} as Playlist,
  setInitialData: (playlistData: Playlist) =>
    set({ initialData: playlistData }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
