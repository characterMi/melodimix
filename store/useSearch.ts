import { create } from "zustand";

interface SearchMusicStore {
  searchValue: string | undefined;
  setSearchValue: (searchValue: string | undefined) => void;
}

export const useSearchMusic = create<SearchMusicStore>((setState) => ({
  searchValue: undefined,
  setSearchValue: (searchValue) => setState({ searchValue }),
}));
