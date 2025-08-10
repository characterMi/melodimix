"use client";

import { useTransitionRouter } from "next-view-transitions";

import useOnPlay from "@/hooks/useOnPlay";
import { usePlayerStore } from "@/store/usePlayerStore";

import FlipArrow from "@/components/FlipArrow";
import NoSongFallback from "@/components/NoSongFallback";
import SongItem from "@/components/SongItem";

import type { Song } from "@/types";

const PageContent = ({
  songs,
  artist,
}: {
  songs: Song[] | null;
  artist: string | undefined;
}) => {
  const onPlay = useOnPlay(songs ?? []);
  const activeId = usePlayerStore((state) => state.activeId);
  const router = useTransitionRouter();

  if (!songs)
    return (
      <NoSongFallback
        className="-mt-2"
        fallbackText={"This artist doesn't have any song."}
        showButton={false}
      />
    );

  return (
    <div
      style={{ marginBottom: activeId ? "7rem" : "0" }}
      className="flex flex-col gap-2 w-full"
    >
      <h3 className="font-semibold text-lg mb-4">
        More Songs by {artist ?? "Unknown artist"}
      </h3>

      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full group">
          <div className="flex-1 overflow-hidden">
            <SongItem onClick={(id) => onPlay(id)} data={song} />
          </div>

          <FlipArrow
            onClick={() => router.push(`/songs/${song.id}`)}
            role="link"
            label={`Go to the ${song.title} song page`}
          />
        </div>
      ))}
    </div>
  );
};

export default PageContent;
