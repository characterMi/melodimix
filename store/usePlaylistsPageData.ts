import { LIMIT } from "@/app/playlists/PlaylistsContent";
import type { Playlist } from "@/types";
import { getPublicPlaylists } from "@/utils/getPublicPlaylists";
import { create } from "zustand";

type Store = {
  pageData: { page: number; data: Playlist[] };
  addOne: (playlist: Playlist) => void;
  addAll: (playlists: Playlist[], page: number) => void;
  updateOne: (newData: Playlist) => void;
  removeOne: (playlistId: number) => void;
};

export const usePlaylistsPageData = create<Store>((set) => ({
  pageData: { page: 0, data: [] },
  addAll(playlists, page) {
    set(({ pageData }) => ({
      pageData: {
        page,
        data: [...pageData.data, ...playlists],
      },
    }));
  },
  addOne(playlist) {
    if (!playlist.is_public) return;

    set(({ pageData }) => {
      // Removing duplicate data...
      if (pageData.data.length % LIMIT === 0) {
        pageData.data.pop();
      }

      const playlists =
        pageData.data.length > 0 ? [playlist, ...pageData.data] : pageData.data;

      return {
        pageData: {
          page: pageData.page,
          data: playlists,
        },
      };
    });
  },
  updateOne(newData) {
    set(({ pageData, removeOne }) => {
      if (!newData.is_public) {
        removeOne(newData.id);
        return {};
      }

      return {
        pageData: {
          page: pageData.page,
          data: pageData.data.map((playlist) => {
            if (playlist.id === newData.id) {
              return newData;
            }
            return playlist;
          }),
        },
      };
    });
  },
  removeOne: (playlistId) =>
    set(({ pageData }) => {
      const playlists = pageData.data.filter(
        (playlist) => playlist.id !== playlistId
      );

      if (pageData.data.length % LIMIT === 0) {
        getPublicPlaylists(1, pageData.data.length)
          .then((data) => {
            // data = [Playlist]
            if (data[0]) playlists.push(data[0]);
          })
          .catch();
      }

      return {
        pageData: {
          page: pageData.page,
          data: playlists,
        },
      };
    }),
}));
