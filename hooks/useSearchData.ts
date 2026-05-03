import { onError } from "@/lib/onError";
import { Playlist, SongWithAuthor } from "@/types";
import { searchForData } from "@/utils/searchForData";
import { useCallback, useEffect, useState } from "react";
import { useSearch } from "../store/useSearch";

export function useSearchData(
  initialData?: {
    songs: SongWithAuthor[];
    playlists: Playlist[];
  },
  shouldApplyFilters = false
) {
  const { searchValue, filters } = useSearch((state) => ({
    searchValue: state.searchValue,
    filters: state.filters,
  }));
  const [searchingFor, setSearchingFor] = useState(filters.searchFor);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<
    (SongWithAuthor | Playlist)[]
  >(initialData?.[searchingFor] ?? []);

  const localSearch = useCallback(
    (searchVal: string) => {
      if (!initialData) return [];

      const filteredData = initialData[filters.searchFor].filter((item) => {
        if (filters.searchFor === "playlists") {
          return (item as Playlist).name
            .toLowerCase()
            .includes(searchVal.toLowerCase());
        }

        return (
          (item as SongWithAuthor).title
            .toLowerCase()
            .includes(searchVal.toLowerCase()) ||
          (item as SongWithAuthor).artist
            .toLowerCase()
            .includes(searchVal.toLowerCase())
        );
      });

      const sortedData = filteredData.sort((a, b) => {
        if (filters.searchFor === "songs" && filters.sortBy === "title") {
          return (a as SongWithAuthor).title.localeCompare(
            (b as SongWithAuthor).title
          );
        }

        if (filters.searchFor === "songs" && filters.sortBy === "artist") {
          return (a as SongWithAuthor).artist.localeCompare(
            (b as SongWithAuthor).artist
          );
        }

        if (filters.searchFor === "playlists" && filters.sortBy === "name") {
          return (a as Playlist).name.localeCompare((b as Playlist).name);
        }

        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      return filters.asc ? sortedData : sortedData.reverse();
    },
    [filters, initialData]
  );

  useEffect(() => {
    setSearchingFor(shouldApplyFilters ? filters.searchFor : "songs");

    const controller = new AbortController();

    (async () => {
      const trimmedSearch = searchValue?.trim() ?? "";

      try {
        setIsSearching(true);

        const data = await searchForData(
          trimmedSearch,
          controller.signal,
          filters,
          shouldApplyFilters
        );

        setSearchResult(data);
      } catch (err: any) {
        console.error("No song found. Reason: ", err);

        if (err?.code === "499" || err?.name === "AbortError") return;

        if (!initialData) {
          onError("Nothing found.");
          return;
        }

        onError("Nothing found. trying to search locally.");

        setSearchResult(localSearch(trimmedSearch));
      } finally {
        setIsSearching(false);
      }
    })();

    return () => {
      controller.abort({ code: "499", message: "User Aborted the request" });
    };
  }, [searchValue, filters]);

  return { isSearching, searchResult, searchingFor };
}
