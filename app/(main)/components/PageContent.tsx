"use client";

import { useMemo } from "react";

import { useInfiniteScroll } from "@/features/infinite-scroll/hooks/useInfiniteScroll";
import { useHomePageData } from "@/features/infinite-scroll/store/useHomePageData";
import { useOnPlay } from "@/features/player/hooks/useOnPlay";
import { getSongs } from "@/features/song-related/utils/getSongs";

import NoSongFallback from "@/components/NoDataFallback";
import LoadMore from "@/features/infinite-scroll/components/LoadMore";
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
