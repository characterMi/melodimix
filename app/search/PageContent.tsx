"use client";

import SearchContent from "@/components/SearchContent";
import { useSearchMusic } from "@/hooks/useSearch";
import { Song } from "@/types/types";

const PageContent = ({ songs }: { songs: Song[] }) => {
  const { searchValue } = useSearchMusic();

  let filteredSongs = songs;

  if (searchValue)
    filteredSongs = songs.filter((song) =>
      song.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  return <SearchContent songs={filteredSongs} />;
};

export default PageContent;
