"use client";

import { useRouter } from "next/navigation";
import { MdArrowOutward } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import useOnPlay from "@/features/player/hooks/useOnPlay";
import { usePlayerStore } from "@/features/player/store/usePlayerStore";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";

import NoSongFallback from "@/components/NoDataFallback";
import SongItem from "@/features/song-related/components/SongItem";
import AddSongButton from "./AddSongButton";

const Library = ({ songs, isMobile }: { songs: Song[]; isMobile?: true }) => {
  const activeId = usePlayerStore((state) => state.activeId);
  const onPlay = useOnPlay(songs);

  const router = useRouter();

  if (songs.length === 0) {
    return (
      <div className="h-screen w-full px-2 md:px-3">
        <AddSongButton />
        <NoSongFallback className="m-4" />
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        "flex flex-col px-2 md:px-3",
        activeId && !isMobile && "pb-[140px]",
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
          <a
            href="/profile"
            className={cnWithReduceMotion(
              "inline-flex items-center justify-center gap-2 text-neutral-400 hover:text-white focus-visible:text-white outline-none transition-colors",
            )}
            onClick={(e) => {
              e.preventDefault();

              if (isMobile) window.history.back();

              setTimeout(() => router.push("/profile", { scroll: false }), 100);
            }}
          >
            See more <MdArrowOutward size={20} />
          </a>
        </div>
      )}
    </div>
  );
};
export default Library;
