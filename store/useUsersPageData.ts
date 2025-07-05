import type { Song } from "@/types";
import { create } from "zustand";

type Store = {
  pageData: { page: number; songs: Song[] };
  addAll: (songs: Song[], page: number) => void;
};

export const useUsersPageData = create<Store>((set) => ({
  pageData: { page: 0, songs: [] },
  addAll(songs, page) {
    set(({ pageData }) => ({
      pageData: {
        page,
        songs: [...pageData.songs, ...songs],
      },
    }));
  },
}));
