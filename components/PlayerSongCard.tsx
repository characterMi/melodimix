import { useEffect, useRef } from "react";
import { IoIosArrowUp } from "react-icons/io";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMobilePlayer } from "@/hooks/useMobilePlayer";

import LikeButton from "./LikeButton";
import MobilePlayer from "./MobilePlayer";
import PlayerTypeButton from "./PlayerTypeButton";
import SongItem from "./SongItem";
import SongOptions from "./SongOptions";

import type { PlayerType } from "@/store/usePlayerStore";
import type { Song } from "@/types";

const PlayerSongCard = ({
  song,
  playerType,
  songUrl,
  children,
}: {
  song: Song;
  playerType: PlayerType;
  songUrl: string;
  children: React.ReactNode;
}) => {
  const isMobile = useMediaQuery("(max-width: 639px)");

  const closeMobilePlayerButton = useRef<HTMLButtonElement>(null);

  const { isMobilePlayerOpen, setIsMobilePlayerOpen, openMobilePlayer } =
    useMobilePlayer();

  useEffect(() => {
    if (!isMobilePlayerOpen) return;

    closeMobilePlayerButton.current?.focus();

    const onPopState = () => setIsMobilePlayerOpen(false);

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, [isMobilePlayerOpen]);

  return (
    <>
      <div className="flex w-full justify-start relative">
        <div className="flex items-center gap-x-4 w-full">
          <SongItem
            isPlayer
            data={song}
            showAuthor={false}
            shouldRunAnimationIfCurrentlyPlaying={false}
            onClick={isMobile ? openMobilePlayer : undefined}
            ariaLive="polite"
          />

          <div className="flex items-center bg-black h-full absolute top-0 right-0 pl-1 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black after:z-[1]">
            <div
              className="hidden sm:flex items-center gap-2 h-full"
              aria-hidden={isMobile}
            >
              <LikeButton song={song} />

              <PlayerTypeButton playerType={playerType} />

              <SongOptions song={song} songUrl={songUrl} />
            </div>

            <button
              className="cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity sm:hidden"
              onClick={openMobilePlayer}
              aria-label="Expand mobile player"
              aria-controls="mobile-player"
              aria-expanded={isMobilePlayerOpen}
              aria-hidden={!isMobile}
            >
              <IoIosArrowUp size={28} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <MobilePlayer
        song={song}
        songUrl={songUrl}
        closeMobilePlayerButton={closeMobilePlayerButton}
        isMobilePlayerOpen={isMobilePlayerOpen}
      >
        {children}
      </MobilePlayer>
    </>
  );
};

export default PlayerSongCard;
