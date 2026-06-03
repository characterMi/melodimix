import { create } from "zustand";

type PlaylistDetailsModalStore = Omit<ModalStore, "onOpen"> & {
  playlistData: Playlist | undefined;
  onOpen: (data?: Playlist) => void;
};

export const usePlaylistDetailsModal = create<PlaylistDetailsModalStore>(
  (set) => ({
    isOpen: false,
    playlistData: undefined,
    onOpen: (data) => set({ isOpen: true, playlistData: data }),
    onClose: () => set({ isOpen: false, playlistData: undefined }),
  }),
);
