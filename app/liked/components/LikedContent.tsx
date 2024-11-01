"use client";

import NoSongFallback from "@/components/NoSongFallback";
import SongCard from "@/components/SongCard";
import useOnPlay from "@/hooks/useOnPlay";
import { usePlayer } from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import type { Song } from "@/types/types";

export const LikedContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  const activeId = usePlayer((state) => state.activeId);

  const { isLoading, user } = useUser();

  if (!isLoading && !user) {
    return (
      <h1 className="flex flex-col gap-y-2 m-4">
        Seems like you didn't sign-in 🤔 if that's true, Please first sign-in to
        Your account.
      </h1>
    );
  }

  if (songs.length === 0) return <NoSongFallback className="m-4" />;

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 p-2 sm:p-6 ${
        activeId && "mb-28"
      }`}
    >
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <SongCard data={song} onClick={(id) => onPlay(id)} />
        </div>
      ))}
    </div>
  );
};
