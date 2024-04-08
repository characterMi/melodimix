"use client";

import type { Song } from "@/types/types";
import { useRouter } from "next/navigation";
import { RxReload } from "react-icons/rx";
import SongCard from "@/components/SongCard";
import { useOnPlay } from "@/hooks/useOnPlay";
import { usePlayer } from "@/hooks/usePlayer";

const PageContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  const activeId = usePlayer((state) => state.activeId);

  const router = useRouter();

  if (songs.length === 0) {
    return (
      <div className="flex gap-x-2 items-center text-neutral-400 px-6 text-xl mt-4">
        <h1>No song available.</h1>
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
    <section
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 mt-4 ${
        activeId && "mb-28"
      }`}
    >
      {songs.map((song) => (
        <SongCard
          key={song.id}
          onClick={(id: string) => onPlay(id)}
          data={song}
        />
      ))}
    </section>
  );
};

export default PageContent;
