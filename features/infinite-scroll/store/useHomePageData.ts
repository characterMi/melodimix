import { create } from "zustand";

import { LIMIT } from "@/app/(main)/components/PageContent";

type Store = {
  pageData: { page: number; data: SongWithAuthor[] };
  addOne: (song: SongWithAuthor) => void;
  addAll: (songs: SongWithAuthor[], page: number) => void;
  updateOne: (newData: SongWithAuthor) => void;
};

export const useHomePageData = create<Store>((set) => ({
  pageData: { page: 0, data: [] },
  addAll(songs, page) {
    set(({ pageData }) => ({
      pageData: {
        page,
        data: [...pageData.data, ...songs],
      },
    }));
  },
  addOne(song) {
    set(({ pageData }) => {
      // Removing duplicate data...
      if (pageData.data.length % LIMIT === 0) {
        pageData.data.pop();
      }

      const songs =
        pageData.data.length > 0 ? [song, ...pageData.data] : pageData.data;

      return {
        pageData: {
          page: pageData.page,
          data: songs,
        },
      };
    });
  },
  updateOne(newData) {
    set(({ pageData }) => ({
      pageData: {
        page: pageData.page,
        data: pageData.data.map((song) => {
          if (song.id === newData.id) {
            return newData;
          }
          return song;
        }),
      },
    }));
  },
}));
