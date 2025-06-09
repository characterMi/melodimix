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

const LIMIT = 25;

const SongCard = ({
  song,
  onPlay,
}: {
  song: Song;
  onPlay: (id: string) => void;
}) => (
  <div className="flex items-center gap-x-4 w-full">
    <div className="flex-1 overflow-hidden">
      <SongItem data={song} onClick={(id) => onPlay(id)} />
    </div>

    <LikeButton song={song} initialIsLiked />
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
    if (page === 0) {
      addAll(initialSongs, initialSongs.length === LIMIT ? page + 1 : page);
    }
  }, []);

  if (isUserLoading) {
    return <Loader className="flex justify-center md:px-6 md:justify-start" />;
  }

  if (!session?.user) {
    return (
      <h2 className="flex flex-col gap-y-2 m-4">
        Seems like you didn't sign-in 🤔 if that's true, Please first sign-in to
        Your account.
      </h2>
    );
  }

  if (songs.length === 0)
    return (
      <NoSongFallback className="m-4" fallbackText="There is nothing here." />
    );

  return (
    <div style={{ marginBottom: activeId ? "7rem" : "0" }}>
      <div className="flex flex-col gap-y-2 p-2 sm:p-6 w-full">
        {songs.length === 0 &&
          initialSongs.map((song) => (
            <SongCard key={song.id} onPlay={onPlay} song={song} />
          ))}

        {songsToRender}
      </div>

      <LoadMore
        numOfSongs={songs.length}
        currentPage={page}
        setSongs={addAll}
        getSongsPromise={getLikedSongs}
        limit={LIMIT}
      />
    </div>
  );
};
