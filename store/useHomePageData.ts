import type { Song } from "@/types";
import { create } from "zustand";

type Store = {
  pageData: { page: number; songs: Song[] };
  addOne: (song: Song) => void;
  addAll: (songs: Song[], page: number) => void;
};

export const useHomePageData = create<Store>((set) => ({
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
    set(({ pageData }) => ({
      pageData: {
        page: pageData.page,
        songs: [song, ...pageData.songs],
      },
    }));
  },
}));
