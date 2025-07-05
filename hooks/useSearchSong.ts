import { Song } from "@/types";
import { searchForSongs } from "@/utils/searchForSongs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchMusic } from "../store/useSearch";

export function useSearchSong(songs?: Song[]) {
  const searchValue = useSearchMusic((state) => state.searchValue);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(songs ?? []);

  useEffect(() => {
    if (!searchValue?.trim()) {
      setFilteredSongs(songs ?? []);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setIsSearching(true);
        const data = await searchForSongs(searchValue, controller.signal);

        setFilteredSongs(data);
      } catch (err: any) {
        console.error("No song found. Reason: ", err);
        if (err?.code === "499" || !songs) return;

        toast.error("No song found. trying to search locally.");

        setFilteredSongs(
          songs.filter(
            (song) =>
              song.title.toLowerCase().includes(searchValue.toLowerCase()) ||
              song.artist.toLowerCase().includes(searchValue.toLowerCase())
          )
        );
      } finally {
        setIsSearching(false);
      }
    })();

    return () => {
      controller.abort({ code: "499", message: "User Aborted the request" });
    };
  }, [searchValue]);

  return { isSearching, filteredSongs };
}
