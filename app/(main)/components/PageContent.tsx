"use client";

import { getSongs } from "@/utils/getSongs";
import LoadMore from "@/components/LoadMore";
import NoSongFallback from "@/components/NoSongFallback";
import SongCard from "@/components/SongCard";
import { useOnPlay } from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types";
import { useHomePageData } from "@/store/useHomePageData";
import { useEffect, useMemo } from "react";

const LIMIT = 20;

const PageContent = ({ initialSongs }: { initialSongs: Song[] }) => {
  const {
    pageData: { songs, page },
    addAll,
  } = useHomePageData();

  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);

  const songsToRender = useMemo(() => {
    return songs.map((song) => (
      <SongCard key={song.id} onClick={onPlay} data={song} />
    ));
  }, [songs]);

  useEffect(() => {
    if (page === 0) {
      addAll(initialSongs, initialSongs.length === LIMIT ? page + 1 : page);
    }
  }, []);

  if (songs.length === 0) return <NoSongFallback className="px-6 text-xl" />;

  return (
    <div style={{ marginBottom: activeId ? "7rem" : "0" }}>
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 mt-4">
        {songs.length === 0 &&
          initialSongs.map((song) => (
            <SongCard key={song.id} onClick={onPlay} data={song} />
          ))}

        {songsToRender}
      </section>

      <LoadMore
        numOfSongs={songs.length}
        currentPage={page}
        setSongs={addAll}
        getSongsPromise={getSongs}
        limit={LIMIT}
      />
    </div>
  );
};

export default PageContent;
