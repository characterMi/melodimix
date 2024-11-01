"use client";

import useOnPlay from "@/hooks/useOnPlay";
import type { Song } from "@/types/types";
import AddSongButton from "./AddSongButton";
import NoSongFallback from "./NoSongFallback";
import SongItem from "./SongItem";

const Library = ({ songs }: { songs: Song[] }) => {
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
    <div className="flex flex-col">
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
