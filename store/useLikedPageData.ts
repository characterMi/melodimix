import type { Song } from "@/types";
import { create } from "zustand";

type Store = {
  pageData: { page: number; songs: Song[] };
  addOne: (song: Song) => void;
  addAll: (songs: Song[], page: number) => void;
  removeOne: (songId: string) => void;
  removeAll: () => void;
};

export const useLikedPageData = create<Store>((set) => ({
  pageData: { page: 0, songs: [] },
  addAll(songs, page) {
    set(({ pageData }) => ({
      pageData: {
        page,
        songs: [...pageData.songs, ...songs],
      },
    }));
  },
  addOne(song) {
    set(({ pageData }) => {
      const songs =
        pageData.songs.length > 0 ? [song, ...pageData.songs] : pageData.songs;

      return {
        pageData: {
          page: pageData.page,
          songs,
        },
      };
    });
  },
  removeOne(songId) {
    set(({ pageData }) => ({
      pageData: {
        page: pageData.page,
        songs: pageData.songs.filter((song) => song.id !== songId),
      },
    }));
  },
  removeAll() {
    set(() => ({
      pageData: {
        page: 0,
        songs: [],
      },
    }));
  },
}));
