import type { Playlist } from "@/types";
import { create } from "zustand";

type PlaylistModalStore = Omit<ModalStore, "onOpen"> & {
  initialData: Playlist | undefined;
  clearInitialData: () => void;
  onOpen: (data?: Playlist) => void;
};

export const usePlaylistModal = create<PlaylistModalStore>((set) => ({
  isOpen: false,
  initialData: undefined,
  clearInitialData: () => set({ initialData: undefined }),
  onOpen: (data) => set({ isOpen: true, initialData: data }),
  onClose: () => set({ isOpen: false }),
}));
