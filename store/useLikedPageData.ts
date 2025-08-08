import { getLikedSongs } from "@/actions/getLikedSongs";
import { LIMIT } from "@/app/liked/components/LikedContent";
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
  addAll: (songs, page) => {
    set(({ pageData }) => ({
      pageData: {
        page,
        songs: [...pageData.songs, ...songs],
      },
    }));
  },
  addOne: (song) => {
    set(({ pageData }) => {
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
  removeOne: (songId) =>
    set(({ pageData }) => {
      const songs = pageData.songs.filter((song) => song.id !== songId);

      if (pageData.songs.length % LIMIT === 0) {
        getLikedSongs(1, pageData.songs.length)
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
          songs,
        },
      };
    }),
  removeAll: () => {
    set(() => ({
      pageData: {
        page: 0,
        songs: [],
      },
    }));
  },
}));
