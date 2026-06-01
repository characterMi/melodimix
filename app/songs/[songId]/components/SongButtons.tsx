"use client";

import { IoShareSocialOutline } from "react-icons/io5";

import { useLoadSongUrl } from "@/features/player/hooks/useLoadSongUrl";
import { usePlayerStore } from "@/features/player/store/usePlayerStore";
import { cnWithReduceMotion } from "@/features/reduce-motion/lib";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { shareSong } from "@/lib/share";

import LikeButton from "@/features/like-song/components/LikeButton";
import SongOptions from "@/features/player/components/SongOptions";
import PlayButton from "@/features/song-related/components/PlayButton";

const SongButtons = ({ song }: { song: Song }) => {
  const songUrl = useLoadSongUrl(song);
  const isMobile = useMediaQuery("(max-width: 639px)");

  const setId = usePlayerStore((state) => state.setId);

  return (
    <>
      <div className="flex items-center gap-4">
        <LikeButton song={song} size={isMobile ? "sm" : "lg"} />

        <button
          className={cnWithReduceMotion(
            "hover:opacity-50 focus-visible:opacity-50 transition-opacity outline-none",
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
