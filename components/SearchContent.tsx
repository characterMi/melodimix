"use client";

import { Song } from "@/types/types";
import SongItem from "./SongItem";
import LikedButton from "./LikedButton";

const SearchContent = ({ songs }: { songs: Song[] }) => {
  if (songs.length === 0) {
    return (
      <h1 className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No songs found.
      </h1>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <SongItem onClick={() => {}} data={song} />
          </div>

          <LikedButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};
export default SearchContent;
