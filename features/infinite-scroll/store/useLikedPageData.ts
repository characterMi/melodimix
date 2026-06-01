import { create } from "zustand";

import { LIMIT } from "@/app/liked/components/LikedContent";
import { getLikedSongs } from "@/features/song-related/actions";

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
          .then((data) => {
            // data = [Song]
            const newSong = data[0];
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
