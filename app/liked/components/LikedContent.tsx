"use client";

import { getLikedSongs } from "@/actions/getLikedSongs";
import LikeButton from "@/components/LikeButton";
import Loader from "@/components/Loader";
import LoadMore from "@/components/LoadMore";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useLikedPageData } from "@/store/useLikedPageData";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo } from "react";

export const LIMIT = 25;

const SongCard = ({
  song,
  onPlay,
}: {
  song: Song;
  onPlay: (id: string) => void;
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
    pageData: { songs, page },
    addAll,
  } = useLikedPageData();

  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);
  const { isLoading: isUserLoading, session } = useSessionContext();

  const songsToRender = useMemo(() => {
    return songs.map((song) => (
      <SongCard key={song.id} onPlay={onPlay} song={song} />
    ));
  }, [songs]);

  useEffect(() => {
    if (initialSongs.length > 0 && songs.length === 0) {
      addAll(initialSongs, initialSongs.length === LIMIT ? page + 1 : page);
    }
  }, [initialSongs]);

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

  if (initialSongs.length === 0)
    return (
      <NoSongFallback
        className="mx-6 mt-4"
        fallbackText="There is nothing here."
      />
    );

  return (
    <div style={{ marginBottom: activeId ? "7rem" : "0" }}>
      <div className="flex flex-col gap-y-2 p-2 sm:p-6 pb-0 w-full">
        {songs.length === 0 &&
          initialSongs.map((song) => (
            <SongCard key={song.id} onPlay={onPlay} song={song} />
          ))}

        {songsToRender}
      </div>

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
    </div>
  );
};
