import { LIMIT } from "@/app/(main)/components/PageContent";
import type { Song } from "@/types";
import { create } from "zustand";

type Store = {
  pageData: { page: number; songs: Song[] };
  addOne: (song: Song) => void;
  addAll: (songs: Song[], page: number) => void;
  updateOne: (newData: Song) => void;
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
    set(({ pageData }) => {
      // Removing duplicate data...
      if (pageData.songs.length % LIMIT === 0) {
        pageData.songs.pop();
      }

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
  updateOne(newData) {
    set(({ pageData }) => ({
      pageData: {
        page: pageData.page,
        songs: pageData.songs.map((song) => {
          if (song.id === newData.id) {
            return newData;
          }
          return song;
        }),
      },
    }));
  },
}));
