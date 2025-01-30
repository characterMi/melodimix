import { Song } from "@/types/types";
import { useLayoutEffect, useState } from "react";
import { useSearchMusic } from "../store/useSearch";

export function useSearchSong(songs: Song[]) {
  const { searchValue } = useSearchMusic();
  const [filteredSongs, setFilteredSongs] = useState(songs);

  useLayoutEffect(() => {
    setFilteredSongs(
      songs.filter((song) =>
        song.title.toLowerCase().includes(searchValue?.toLowerCase() || "")
      )
    );
  }, [searchValue]);

  return filteredSongs;
}
