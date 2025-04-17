import { create } from "zustand";

interface LikedSongs {
  likedSongs: Record<string, boolean>;
  setLikedSongs: (songId: string, isLiked: boolean) => void;
  removeIdFromLikedSongs: (songId: string) => void;
  clearLikedSongs: () => void;
}

export const useLikedSongs = create<LikedSongs>((setState) => ({
  likedSongs: {},
  setLikedSongs: (songId, isLiked) =>
    setState((state) => ({
      likedSongs: { ...state.likedSongs, [songId]: isLiked },
    })),
  removeIdFromLikedSongs: (songId) =>
    setState((state) => ({
      likedSongs: { ...state.likedSongs, [songId]: false },
    })),
  clearLikedSongs: () => setState({ likedSongs: {} }),
}));
