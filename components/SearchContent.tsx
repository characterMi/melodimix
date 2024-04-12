"use client";

import type { Song } from "@/types/types";
import { useRouter } from "next/navigation";
import SongItem from "./SongItem";
import LikedButton from "./LikedButton";
import { RxReload } from "react-icons/rx";
import useOnPlay from "@/hooks/useOnPlay";

const SearchContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  const router = useRouter();

  if (songs.length === 0) {
    return (
      <div className="flex gap-x-2 items-center text-neutral-400 px-6">
        <h1 className="flex flex-col gap-y-2">No songs found.</h1>
        <button
          className="flex items-center gap-x-1 underline"
          onClick={() => router.refresh()}
        >
          Refresh
          <RxReload />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1 overflow-hidden">
            <SongItem onClick={(id) => onPlay(id)} data={song} />
          </div>

          <LikedButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};
export default SearchContent;
