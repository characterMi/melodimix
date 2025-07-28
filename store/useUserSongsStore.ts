import type { Song } from "@/types";
import { create } from "zustand";

interface UserSongs {
  userSongs: Song[];
  setUserSongs: (songs: Song[]) => void;
  addOneSong: (song: Song) => void;
  deleteSong: (songId: string) => void;
}

export const useUserSongs = create<UserSongs>((setState) => ({
  userSongs: [],
  setUserSongs: (songs) =>
    setState(() => ({
      userSongs: songs,
    })),
  addOneSong: (song) =>
    setState((state) => ({
      userSongs: [song, ...state.userSongs],
    })),
  deleteSong: (songId) =>
    setState((state) => ({
      userSongs: state.userSongs.filter((song) => song.id !== songId),
    })),
}));
