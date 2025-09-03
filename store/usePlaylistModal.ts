import type { PlaylistWithoutCreatedAt } from "@/types";
import { create } from "zustand";

interface PlaylistModalStore {
  isOpen: boolean;
  initialData: PlaylistWithoutCreatedAt | undefined;
  clearInitialData: () => void;
  onOpen: (data?: PlaylistWithoutCreatedAt) => void;
  onClose: () => void;
}

export const usePlaylistModal = create<PlaylistModalStore>((set) => ({
  isOpen: false,
  initialData: undefined,
  clearInitialData: () => set({ initialData: undefined }),
  onOpen: (data) => set({ isOpen: true, initialData: data }),
  onClose: () => set({ isOpen: false }),
}));
