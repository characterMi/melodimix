"use client";

import LoadMore from "@/components/LoadMore";
import NoPlaylistFallback from "@/components/NoSongFallback";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useLoadPlaylistPoster } from "@/hooks/useLoadPlaylistPoster";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { usePlaylistsPageData } from "@/store/usePlaylistsPageData";
import type { Playlist } from "@/types";
import { getPublicPlaylists } from "@/utils/getPublicPlaylists";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

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
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ));
    }

    return playlists.map((playlist) => (
      <PlaylistCard key={playlist.id} playlist={playlist} />
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
      <div className="gap-x-2 gap-y-6 p-6 pb-0 w-full grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
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

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
  const poster = useLoadPlaylistPoster(playlist);

  return (
    <Link
      href={`/users/${playlist.user_id}/playlists/${playlist.id}`}
      className={twMerge(
        "w-full flex flex-col px-1 xss:px-2 bg-neutral-800 outline-none border-none rounded-md hover:-translate-y-[2%] focus-visible:-translate-y-[2%] shadow-2xl",
        !shouldReduceMotion && "transition-transform duration-500"
      )}
    >
      <div className="rounded-md size-full relative after:absolute after:top-0 after:left-0 after:size-full after:bg-neutral-950 after:rounded-md -mt-1 xss:-mt-2">
        <Image
          src={poster ?? "/images/playlist.png"}
          alt={playlist.name}
          width={200}
          height={200}
          className="object-cover size-full rounded-md relative z-[1]"
        />
      </div>

      <div className="size-full truncate py-3">
        <b className="text-white whitespace-nowrap select-none text-base sm:text-lg md:text-base lg:text-lg mt-2 truncate">
          {playlist.name}
        </b>

        <p className="text-neutral-400 text-xs sm:text-sm md:text-xs lg:text-sm font-thin truncate">
          {playlist.song_ids.length <= 0
            ? "No song in this playlist"
            : playlist.song_ids.length === 1
            ? "1 Song"
            : playlist.song_ids.length + " Songs"}
        </p>
      </div>
    </Link>
  );
};
