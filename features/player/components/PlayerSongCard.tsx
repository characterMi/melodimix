import { IoIosArrowUp } from "react-icons/io";
import { twMerge } from "tailwind-merge";

import { useGetDefaultSongColor } from "@/features/player/hooks/useGetDefaultSongColor";
import { usePlayerSongCard } from "@/features/player/hooks/usePlayerSongCard";
import { ColorEntity } from "@/features/player/store/useSongColors";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { shouldReduceMotion } from "@/lib/reduceMotion";

import SongItem from "@/features/song-related/components/SongItem";
import LikeButton from "../../like-song/components/LikeButton";
import MobilePlayer from "./MobilePlayer";
import PlayerTypeButton from "./PlayerTypeButton";
import SongOptions from "./SongOptions";

import { type PlayerType } from "@/features/player/store/usePlayerStore";
import { type SyntheticEvent } from "react";

const PlayerSongCard = ({
  song,
  playerType,
  songUrl,
  children,
  colors,
  onLoad,
}: {
  song: Song;
  playerType: PlayerType;
  songUrl: string;
  children: React.ReactNode;
  colors: ColorEntity | undefined;
  onLoad: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}) => {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const defaultColor = useGetDefaultSongColor();
  const {
    isMobilePlayerOpen,
    openMobilePlayer,
    openMobilePlayerButton,
    closeMobilePlayerButton,
  } = usePlayerSongCard(colors, defaultColor);

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
            onPosterLoad={onLoad}
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
              className={twMerge(
                "cursor-pointer hover:opacity-50 focus-visible:opacity-50 outline-none sm:hidden",
                !shouldReduceMotion && "transition-opacity",
              )}
              onClick={openMobilePlayer}
              aria-label="Expand mobile player"
              aria-controls="mobile-player"
              aria-expanded={isMobilePlayerOpen}
              aria-hidden={!isMobile}
              ref={openMobilePlayerButton}
            >
              <IoIosArrowUp size={28} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <MobilePlayer
        color={colors?.medium ?? "#000000"}
        defaultColor={defaultColor}
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
