import { create } from "zustand";

interface LikedSongs {
  likedSongs: string[];
  setLikedSongs: (songId: string) => void;
  removeIdFromLikedSongs: (songId: string) => void;
  clearLikedSongs: () => void;
}

export const useLikedSongs = create<LikedSongs>((setState) => ({
  likedSongs: [],
  setLikedSongs: (songId) =>
    setState((state) => ({ likedSongs: [...state.likedSongs, songId] })),
  removeIdFromLikedSongs: (songId) =>
    setState((state) => ({
      likedSongs: state.likedSongs.filter((id) => id !== songId),
    })),
  clearLikedSongs: () => setState({ likedSongs: [] }),
}));
