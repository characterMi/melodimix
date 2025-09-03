import type { Song } from "@/types";
import { create } from "zustand";

interface UserSongs {
  userSongs: Song[];
  setUserSongs: (songs: Song[]) => void;
  addOneSong: (song: Song) => void;
  deleteSong: (songId: number) => void;
}

export const useUserSongs = create<UserSongs>((setState) => ({
  userSongs: [],
  setUserSongs: (songs) =>
    setState(() => ({
      userSongs: songs,
    })),
  addOneSong: (song) =>
    setState(({ userSongs }) => {
      if (userSongs.length === 10) userSongs.pop();

      return { userSongs: [song, ...userSongs] };
    }),
  deleteSong: (songId) =>
    setState((state) => ({
      userSongs: state.userSongs.filter((song) => song.id !== songId),
    })),
}));
