"use client";

import LikeButton from "@/components/LikeButton";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Song } from "@/types/types";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const LikedContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  const activeId = usePlayerStore((state) => state.activeId);

  const { isLoading, session } = useSessionContext();

  if (!isLoading && !session?.user) {
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
    <div
      className={`flex flex-col gap-y-2 p-2 sm:p-6 w-full ${
        activeId && "mb-28"
      }`}
    >
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1 overflow-hidden">
            <SongItem data={song} onClick={(id) => onPlay(id)} />
          </div>

          <LikeButton songId={song.id} songTitle={song.title} initialIsLiked />
        </div>
      ))}
    </div>
  );
};
