import { create } from "zustand";

export type Filters = { asc: boolean } & (
  | {
      filter: "title" | "artist" | "date";
      searchFor: "songs";
    }
  | {
      filter: "name" | "date";
      searchFor: "playlists";
    }
);

interface SearchMusicStore {
  searchValue: string | undefined;
  setSearchValue: (searchValue: string | undefined) => void;
  filters: Filters;
  setFilters: (newFilters: Filters) => void;
}

export const useSearchMusic = create<SearchMusicStore>((setState) => ({
  searchValue: undefined,
  setSearchValue: (searchValue) => setState({ searchValue }),
  filters: {
    asc: false,
    filter: "title",
    searchFor: "songs",
  },
  setFilters: (newFilters) => setState({ filters: newFilters }),
}));
