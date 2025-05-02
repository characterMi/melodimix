"use client";

import useOnPlay from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types/types";
import { twMerge } from "tailwind-merge";
import AddSongButton from "./AddSongButton";
import NoSongFallback from "./NoSongFallback";
import SongItem from "./SongItem";

const Library = ({ songs }: { songs: Song[] }) => {
  const activeId = usePlayerStore((state) => state.activeId);
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return (
      <>
        <AddSongButton />
        <NoSongFallback className="m-4" />
      </>
    );
  }

  return (
    <div className={twMerge("flex flex-col", activeId && "pb-28")}>
      <AddSongButton />

      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((song) => (
          <SongItem onClick={(id) => onPlay(id)} key={song.id} data={song} />
        ))}
      </div>
    </div>
  );
};
export default Library;
