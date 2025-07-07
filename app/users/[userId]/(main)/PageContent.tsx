"use client";

import { getUserSongs } from "@/actions/getUserSongs";
import LikeButton from "@/components/LikeButton";
import LoadMore from "@/components/LoadMore";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import { useOnPlay } from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import {
  useCurrentUserPageData,
  useUsersPageData,
} from "@/store/useUsersPageData";
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
  const addAll = useUsersPageData((state) => state.addAll);
  const pageData = useCurrentUserPageData(userId);

  const onPlay = useOnPlay(pageData?.songs ?? []);
  const activeId = usePlayerStore((state) => state.activeId);

  const songsToRender = useMemo(() => {
    return pageData?.songs.map((song) => (
      <SongCard key={song.id} onPlay={onPlay} song={song} />
    ));
  }, [pageData?.songs]);

  useEffect(() => {
    if (initialSongs.length > 0 && (pageData?.songs.length ?? 0) === 0) {
      addAll(
        userId,
        initialSongs,
        initialSongs.length === LIMIT
          ? (pageData?.page ?? 0) + 1
          : pageData?.page ?? 0
      );
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
      <div className="flex flex-col gap-2 w-full">
        {(pageData?.songs.length ?? 0) === 0 &&
          initialSongs.map((song) => (
            <SongCard key={song.id} onPlay={onPlay} song={song} />
          ))}

        {songsToRender}
      </div>

      <LoadMore
        initialStatus={
          pageData?.songs.length
            ? pageData.songs.length % LIMIT
              ? "ended"
              : "loadmore"
            : initialSongs.length === LIMIT
            ? "loadmore"
            : "ended"
        }
        currentPage={pageData?.page ?? 0}
        setSongs={(songs, page) => addAll(userId, songs, page)}
        getSongsPromise={(limit, offset) =>
          getUserSongs({ limit, offset, userId })
        }
        limit={LIMIT}
      />
    </div>
  );
};

export default PageContent;
