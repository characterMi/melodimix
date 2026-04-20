import { getLikedSongs } from "@/actions/song.actions";
import { LIMIT } from "@/app/liked/components/LikedContent";
import type { Song } from "@/types";
import { create } from "zustand";

type Store = {
  pageData: { page: number; data: Song[] };
  addOne: (song: Song) => void;
  addAll: (songs: Song[], page: number) => void;
  removeOne: (songId: number) => void;
  removeAll: () => void;
};

export const useLikedPageData = create<Store>((set) => ({
  pageData: { page: 0, data: [] },
  addAll: (songs, page) => {
    set(({ pageData }) => ({
      pageData: {
        page,
        data: [...pageData.data, ...songs],
      },
    }));
  },
  addOne: (song) => {
    set(({ pageData }) => {
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
  removeOne: (songId) =>
    set(({ pageData }) => {
      const songs = pageData.data.filter((song) => song.id !== songId);

      if (pageData.data.length % LIMIT === 0) {
        getLikedSongs(1, pageData.data.length)
          .then((songs) => {
            // songs = [Song]
            const newSong = songs[0];
            if (newSong) songs.push(newSong);
          })
          .catch();
      }

      return {
        pageData: {
          page: pageData.page,
          data: songs,
        },
      };
    }),
  removeAll: () => {
    set(() => ({
      pageData: {
        page: 0,
        data: [],
      },
    }));
  },
}));
