import { create } from "zustand";

export type Filters = { asc: boolean } & (
  | {
      sortBy: "title" | "artist" | "date";
      searchFor: "songs";
    }
  | {
      sortBy: "name" | "date";
      searchFor: "playlists";
    }
);

interface SearchStore {
  searchValue: string | undefined;
  setSearchValue: (searchValue: string | undefined) => void;
  filters: Filters;
  setFilters: (newFilters: Filters) => void;
}

export const useSearch = create<SearchStore>((setState) => ({
  searchValue: undefined,
  setSearchValue: (searchValue) => setState({ searchValue }),
  filters: {
    asc: false,
    sortBy: "date",
    searchFor: "songs",
  },
  setFilters: (newFilters) => setState({ filters: newFilters }),
}));
