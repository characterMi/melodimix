"use client";

import { getUserSongs } from "@/actions/getUserSongs";
import LikeButton from "@/components/LikeButton";
import LoadMore from "@/components/LoadMore";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import { useOnPlay } from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useUsersPageData } from "@/store/useUsersPageData";
import type { Song } from "@/types";
import { useEffect, useMemo } from "react";

const LIMIT = 20;

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

const PageContent = ({
  initialSongs,
  userId,
}: {
  initialSongs: Song[];
  userId: string;
}) => {
  const {
    pageData: { songs, page },
    addAll,
  } = useUsersPageData();

  const onPlay = useOnPlay(songs);
  const activeId = usePlayerStore((state) => state.activeId);

  const songsToRender = useMemo(() => {
    return songs.map((song) => (
      <SongCard key={song.id} onPlay={onPlay} song={song} />
    ));
  }, [songs]);

  useEffect(() => {
    if (initialSongs.length > 0 && songs.length === 0) {
      addAll(initialSongs, initialSongs.length === LIMIT ? page + 1 : page);
    }
  }, []);

  if (initialSongs.length === 0)
    return (
      <NoSongFallback
        className="-mt-2"
        fallbackText="User haven't uploaded any songs."
        showButton={false}
      />
    );

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-y-2 w-full"
    >
      <div className="flex flex-col gap-y-2 p-2 sm:p-6 w-full">
        {songs.length === 0 &&
          initialSongs.map((song) => (
            <SongCard key={song.id} onPlay={onPlay} song={song} />
          ))}

        {songsToRender}
      </div>

      <LoadMore
        numOfSongs={initialSongs.length}
        currentPage={page}
        setSongs={addAll}
        getSongsPromise={(limit, offset) =>
          getUserSongs({ limit, offset, userId })
        }
        limit={LIMIT}
      />
    </div>
  );
};

export default PageContent;
