"use client";

import LoadMore from "@/components/LoadMore";
import NoSongFallback from "@/components/NoSongFallback";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useOnPlay } from "@/hooks/useOnPlay";
import { useHomePageData } from "@/store/useHomePageData";
import type { SongWithAuthor } from "@/types";
import { getSongs } from "@/utils/getSongs";
import { useMemo } from "react";
import SongCard from "./SongCard";

export const LIMIT = 20;

const PageContent = ({ initialSongs }: { initialSongs: SongWithAuthor[] }) => {
  const {
    data: songs,
    page,
    addAll,
  } = useInfiniteScroll(initialSongs, useHomePageData(), LIMIT);

  const onPlay = useOnPlay(songs);

  const songsToRender = useMemo(() => {
    if (songs.length === 0) {
      return initialSongs.map((song) => (
        <SongCard key={song.id} onClick={onPlay} data={song} />
      ));
    }

    return songs.map((song) => (
      <SongCard key={song.id} onClick={onPlay} data={song} />
    ));
  }, [songs]);

  if (initialSongs.length === 0)
    return <NoSongFallback className="px-6 text-xl" />;

  return (
    <>
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 mt-4">
        {songsToRender}
      </section>

      <LoadMore
        initialStatus={
          songs.length
            ? songs.length % LIMIT
              ? "ended"
              : "loadmore"
            : initialSongs.length === LIMIT
            ? "loadmore"
            : "ended"
        }
        currentPage={page}
        setData={addAll}
        getDataPromise={getSongs}
        limit={LIMIT}
      />
    </>
  );
};

export default PageContent;
