"use client";

import type { Song } from "@/types/types";
import SongCard from "@/components/SongCard";

const PageContent = ({ songs }: { songs: Song[] }) => {
  if (songs.length === 0) {
    return <h1 className="text-xl mt-4 text-neutral-400">No song available</h1>;
  }

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
      {songs.map((song) => (
        <SongCard key={song.id} onClick={() => {}} data={song} />
      ))}
    </section>
  );
};
export default PageContent;
