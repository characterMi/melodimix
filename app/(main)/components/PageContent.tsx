"use client";

import NoSongFallback from "@/components/NoSongFallback";
import SongCard from "@/components/SongCard";
import { useOnPlay } from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types/types";

const PageContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  const activeId = usePlayerStore((state) => state.activeId);

  if (songs.length === 0) return <NoSongFallback className="px-6 text-xl" />;

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
