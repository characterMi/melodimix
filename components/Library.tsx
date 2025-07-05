"use client";

import useOnPlay from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import AddSongButton from "./AddSongButton";
import NoSongFallback from "./NoSongFallback";
import SongItem from "./SongItem";

const Library = ({ songs, isMobile }: { songs: Song[]; isMobile?: true }) => {
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
    <div
      className={twMerge(
        "flex flex-col px-3",
        activeId && !isMobile && "pb-28"
      )}
    >
      <AddSongButton />

      <div className="flex flex-col gap-y-2 mt-4">
        {songs.map((song) => (
          <SongItem
            onClick={(id) => onPlay(id)}
            key={song.id}
            data={song}
            showAuthor={false}
          />
        ))}
      </div>

      {songs.length === 10 && (
        <div className="flex items-center justify-center py-6">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-2 text-neutral-400 hover:text-white focus-visible:text-white outline-none transition-colors"
          >
            See more <MdArrowOutward size={20} />
          </Link>
        </div>
      )}
    </div>
  );
};
export default Library;
