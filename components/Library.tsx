"use client";

import type { Song } from "@/types/types";
import { useRouter } from "next/navigation";
import { RxReload } from "react-icons/rx";
import SongItem from "./SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import AddSongButton from "./AddSongButton";

const Library = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  const router = useRouter();

  if (songs.length === 0) {
    return (
      <>
        <AddSongButton />
        <div className="flex gap-x-2 items-center text-neutral-400 m-4">
          <h1 className="flex flex-col gap-y-2">No song here !</h1>
          <button
            className="flex items-center gap-x-1 underline"
            onClick={() => router.refresh()}
          >
            Refresh
            <RxReload />
          </button>
        </div>
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
