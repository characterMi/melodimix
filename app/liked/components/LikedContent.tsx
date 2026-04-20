"use client";

import { getLikedSongs } from "@/actions/song.actions";
import LikeButton from "@/components/LikeButton";
import Loader from "@/components/Loader";
import LoadMore from "@/components/LoadMore";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import useOnPlay from "@/hooks/useOnPlay";
import { useSession } from "@/hooks/useSession";
import { useLikedPageData } from "@/store/useLikedPageData";
import type { Song } from "@/types";
import { useMemo } from "react";

export const LIMIT = 25;

const SongCard = ({
  song,
  onPlay,
}: {
  song: Song;
  onPlay: (id: number) => void;
}) => (
  <div className="flex items-center gap-x-4 w-full">
    <div className="flex-1 overflow-hidden">
      <SongItem data={song} onClick={(id) => onPlay(id)} showAuthor={false} />
    </div>

    <LikeButton song={song} />
  </div>
);

export const LikedContent = ({ initialSongs }: { initialSongs: Song[] }) => {
  const {
    data: songs,
    page,
    addAll,
  } = useInfiniteScroll(initialSongs, useLikedPageData(), LIMIT);

  const onPlay = useOnPlay(songs);
  const { isLoading: isUserLoading, session } = useSession();

  const songsToRender = useMemo(() => {
    if (songs.length === 0) {
      return initialSongs.map((song) => (
        <SongCard key={song.id} onPlay={onPlay} song={song} />
      ));
    }

    return songs.map((song) => (
      <SongCard key={song.id} onPlay={onPlay} song={song} />
    ));
  }, [songs]);

  if (isUserLoading) {
    return <Loader className="flex justify-center md:px-6 md:justify-start" />;
  }

  if (!session?.user) {
    return (
      <h2 className="flex flex-col gap-y-2 mx-6 mt-4">
        Seems like you're not logged in 🤔 if that's true, Please first login to
        Your account.
      </h2>
    );
  }

  if (initialSongs.length === 0) {
    return (
      <NoSongFallback
        className="mx-6 mt-4"
        fallbackText="There is nothing here."
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 p-6 pb-0 w-full">{songsToRender}</div>

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
        setSongs={addAll}
        getSongsPromise={getLikedSongs}
        limit={LIMIT}
      />
    </>
  );
};
