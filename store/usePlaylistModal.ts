import type { PlaylistWithoutCreatedAt } from "@/types";
import { create } from "zustand";

type PlaylistModalStore = Omit<ModalStore, "onOpen"> & {
  initialData: PlaylistWithoutCreatedAt | undefined;
  clearInitialData: () => void;
  onOpen: (data?: PlaylistWithoutCreatedAt) => void;
};

export const usePlaylistModal = create<PlaylistModalStore>((set) => ({
  isOpen: false,
  initialData: undefined,
  clearInitialData: () => set({ initialData: undefined }),
  onOpen: (data) => set({ isOpen: true, initialData: data }),
  onClose: () => set({ isOpen: false }),
}));
