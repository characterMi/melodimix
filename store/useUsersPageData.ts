import type { Song } from "@/types";
import { create } from "zustand";

type PageData = { page: number; songs: Song[] };
type UserId = string;

type Store = {
  pagesData: Record<UserId, PageData>;
  addAll: (userId: UserId, userSongs: Song[], page: number) => void;
};

export const useUsersPageData = create<Store>((set) => ({
  pagesData: {} as Record<UserId, PageData>,
  addAll: (userId, userSongs, page) =>
    set(({ pagesData }) => ({
      pagesData: {
        ...pagesData,
        [userId]: { songs: [...pagesData[userId].songs, ...userSongs], page },
      },
    })),
}));

export const useCurrentUserPageData = (userId: UserId) =>
  useUsersPageData((state) => state.pagesData[userId]);
