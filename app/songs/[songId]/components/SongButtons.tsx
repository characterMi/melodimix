"use client";

import { IoShareSocialOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

import { useLoadSongUrl } from "@/hooks/useLoadSongUrl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { shareSong } from "@/lib/share";

import LikeButton from "@/components/LikeButton";
import PlayButton from "@/components/PlayButton";
import SongOptions from "@/components/SongOptions";

import { usePlayerStore } from "@/store/usePlayerStore";

import type { Song } from "@/types";

const SongButtons = ({ song }: { song: Song }) => {
  const songUrl = useLoadSongUrl(song);
  const isMobile = useMediaQuery("(max-width: 639px)");

  const setId = usePlayerStore((state) => state.setId);

  return (
    <>
      <div className="flex items-center gap-4">
        <LikeButton song={song} size={isMobile ? "sm" : "lg"} />

        <button
          className={twMerge(
            "hover:opacity-50 focus-visible:opacity-50 outline-none",
            !shouldReduceMotion && "transition-opacity"
          )}
          aria-label="Share the song"
          onClick={() => shareSong(song.title, song.artist, song.id)}
        >
          <IoShareSocialOutline aria-hidden size={isMobile ? 25 : 28} />
        </button>

        <SongOptions
          song={song}
          songUrl={songUrl}
          triggerSize={isMobile ? 25 : 28}
          renderShareButton={false}
        />
      </div>

      <PlayButton
        onClick={() => setId(song.id)}
        aria-label={`Listen to the ${song.title} song`}
      />
    </>
  );
};

export default SongButtons;
