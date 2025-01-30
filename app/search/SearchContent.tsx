"use client";

import useOnPlay from "@/hooks/useOnPlay";
import { useSearchSong } from "@/hooks/useSearchSong";
import { usePlayer } from "@/store/usePlayerStore";
import type { Song } from "@/types/types";
import { twMerge } from "tailwind-merge";
import LikeButton from "../../components/LikeButton";
import NoSongFallback from "../../components/NoSongFallback";
import SongItem from "../../components/SongItem";

const SearchContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);
  const activeId = usePlayer((state) => state.activeId);
  const filteredSongs = useSearchSong(songs);

  if (filteredSongs.length === 0) return <NoSongFallback className="px-6" />;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-y-2 w-full px-6",
        activeId && "mb-28"
      )}
    >
      {filteredSongs.map((song) => (
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
