"use client";

import useOnPlay from "@/hooks/useOnPlay";
import { usePlayer } from "@/hooks/usePlayer";
import type { Song } from "@/types/types";
import { twMerge } from "tailwind-merge";
import LikeButton from "./LikeButton";
import NoSongFallback from "./NoSongFallback";
import SongItem from "./SongItem";

const SearchContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayer((state) => state.activeId);

  if (songs.length === 0) return <NoSongFallback className="px-6" />;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-y-2 w-full px-6",
        activeId && "mb-28"
      )}
    >
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1 overflow-hidden">
            <SongItem onClick={(id) => onPlay(id)} data={song} />
          </div>

          <LikeButton songId={song.id} songTitle={song.title} />
        </div>
      ))}
    </div>
  );
};
export default SearchContent;
