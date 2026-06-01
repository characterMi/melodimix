"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import { useSessionStore } from "@/features/auth/store/useSessionStore";
import { useInfiniteScroll } from "@/features/infinite-scroll/hooks/useInfiniteScroll";
import { usePlaylistsPageData } from "@/features/infinite-scroll/store/usePlaylistsPageData";
import { deletePlaylist } from "@/features/playlist/actions";
import { useLoadPlaylistPoster } from "@/features/playlist/hooks/useLoadPlaylistPoster";
import { getPublicPlaylists } from "@/features/playlist/utils/getPublicPlaylists";
import { isAdmin } from "@/lib/isAdmin";
import { onError } from "@/lib/onError";
import { onSuccess } from "@/lib/onSuccess";
import { shouldReduceMotion } from "@/lib/reduceMotion";

import NoPlaylistFallback from "@/components/NoDataFallback";
import Spinner from "@/components/Spinner";
import VariantButton from "@/components/VariantButton";
import LoadMore from "@/features/infinite-scroll/components/LoadMore";

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
        "w-full flex flex-col px-1 xss:px-2 bg-neutral-800 outline-none border-none rounded-md hover:-translate-y-[2%] focus-visible:-translate-y-[2%] shadow-2xl group",
        !shouldReduceMotion && "transition-transform duration-500",
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

        <DeletePlaylist
          playlistId={playlist.id}
          isPublic={playlist.is_public}
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

const DeletePlaylist = ({
  playlistId,
  isPublic,
}: {
  playlistId: number;
  isPublic: boolean;
}) => {
  const user = useSessionStore((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return;

  if (!isAdmin(user)) return;

  const onClick = async () => {
    if (isDeleting || !user || !isAdmin(user)) return;

    setIsDeleting(true);
    const hasDeleted = await deletePlaylist(playlistId, isPublic, true);

    if (hasDeleted) {
      onSuccess("Playlist deleted successfully!");
    } else {
      onError("Couldn't delete the playlist for some reason.");
    }

    setIsDeleting(false);
  };

  return (
    <VariantButton
      variant="error"
      className="absolute top-2 right-2 size-8 z-[2] rounded-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 disabled:opacity-50"
      disabled={isDeleting}
      onClick={onClick}
    >
      {isDeleting ? (
        <Spinner />
      ) : (
        <LuTrash2 size={20} aria-hidden className="text-white/80" />
      )}
    </VariantButton>
  );
};
