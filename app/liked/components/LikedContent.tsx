"use client";

import LikedButton from "@/components/LikedButton";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { usePlayer } from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import type { Song } from "@/types/types";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { RxReload } from "react-icons/rx";

export const LikedContent = ({ songs }: { songs: Song[] }) => {
  const onPlay = useOnPlay(songs);

  const activeId = usePlayer((state) => state.activeId);

  const { isLoading, user } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/");
    }
  }, [isLoading, user]);

  if (songs.length === 0) {
    return (
      <div className="flex gap-x-2 items-center text-neutral-400 m-4">
        <h1 className="flex flex-col gap-y-2">No song here !</h1>
        <button
          className="flex items-center gap-x-1 underline"
          onClick={() => router.refresh()}
        >
          Refresh
          <RxReload />
        </button>
      </div>
    );
  }

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

          <LikedButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};
