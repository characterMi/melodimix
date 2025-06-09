"use client";

import useOnPlay from "@/hooks/useOnPlay";
import { useSearchSong } from "@/hooks/useSearchSong";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types";
import { twMerge } from "tailwind-merge";
import LikeButton from "../../components/LikeButton";
import NoSongFallback from "../../components/NoSongFallback";
import SongItem from "../../components/SongItem";

const SearchContent = ({ songs }: { songs: Song[] }) => {
  const { filteredSongs, isSearching } = useSearchSong(songs);
  const activeId = usePlayerStore((state) => state.activeId);
  const onPlay = useOnPlay(filteredSongs);

  if (filteredSongs.length === 0)
    return (
      <NoSongFallback
        className="px-6"
        showButton={false}
        fallbackText="There is no results for given query."
      />
    );

  return (
    <div
      className={twMerge(
        "flex flex-col gap-y-2 w-full px-6",
        activeId && "mb-28",
        isSearching && "opacity-50"
      )}
    >
      {filteredSongs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1 overflow-hidden">
            <SongItem onClick={(id) => onPlay(id)} data={song} />
          </div>

          <LikeButton song={song} />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
