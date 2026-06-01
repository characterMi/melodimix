import { create } from "zustand";

type PlaylistModalStore = Omit<ModalStore, "onOpen"> & {
  initialData: Playlist | undefined;
  onOpen: (data?: Playlist) => void;
};

export const usePlaylistModal = create<PlaylistModalStore>((set) => ({
  isOpen: false,
  initialData: undefined,
  onOpen: (data) => set({ isOpen: true, initialData: data }),
  onClose: () => set({ isOpen: false, initialData: undefined }),
}));
