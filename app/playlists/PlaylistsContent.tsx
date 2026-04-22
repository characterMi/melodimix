"use client";

import LoadMore from "@/components/LoadMore";
import NoPlaylistFallback from "@/components/NoSongFallback";
import PlaylistItem from "@/components/PlaylistItem";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePlaylistsPageData } from "@/store/usePlaylistsPageData";
import type { Playlist } from "@/types";
import { getPublicPlaylists } from "@/utils/getPublicPlaylists";
import { useMemo } from "react";

export const LIMIT = 20;

export const PlaylistsContent = ({
  initialPlaylists,
}: {
  initialPlaylists: Playlist[];
}) => {
  const {
    data: playlists,
    page,
    addAll,
  } = useInfiniteScroll(initialPlaylists, usePlaylistsPageData(), LIMIT);

  const playlistsToRender = useMemo(() => {
    if (playlists.length === 0) {
      return initialPlaylists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          playlist={playlist}
          firstSongId={playlist.song_ids[0]}
        />
      ));
    }

    return playlists.map((playlist) => (
      <PlaylistItem
        key={playlist.id}
        playlist={playlist}
        firstSongId={playlist.song_ids[0]}
      />
    ));
  }, [playlists]);

  if (initialPlaylists.length === 0) {
    return (
      <NoPlaylistFallback
        className="mx-6 mt-4"
        fallbackText="There is nothing here."
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 p-6 pb-0 w-full">
        {playlistsToRender}
      </div>

      <LoadMore
        initialStatus={
          playlists.length
            ? playlists.length % LIMIT
              ? "ended"
              : "loadmore"
            : initialPlaylists.length === LIMIT
            ? "loadmore"
            : "ended"
        }
        currentPage={page}
        setData={addAll}
        getDataPromise={getPublicPlaylists}
        limit={LIMIT}
      />
    </>
  );
};
