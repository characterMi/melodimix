import { useCallback, useEffect, useRef } from "react";
import { IoIosArrowUp } from "react-icons/io";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { usePlayerStore, type PlayerType } from "@/store/usePlayerStore";

import LikeButton from "./LikeButton";
import MobilePlayer from "./MobilePlayer";
import PlayerOptions from "./PlayerOptions";
import PlayerTypeButton from "./PlayerTypeButton";
import SongItem from "./SongItem";

import type { Song } from "@/types";
import type { IconType } from "react-icons";

const PlayerSongCard = ({
  song,
  playerType,
  handleChangePlayerType,
  playerTypeIcon: PlayerTypeIcon,
  songUrl,
  children,
}: {
  song: Song;
  playerType: PlayerType;
  handleChangePlayerType: () => void;
  playerTypeIcon: IconType;
  songUrl: string;
  children: React.ReactNode;
}) => {
  const isMobile = useMediaQuery("(max-width: 639px)");

  const closeMobilePlayerButton = useRef<HTMLButtonElement>(null);
  const { isMobilePlayerOpen, setIsMobilePlayerOpen } = usePlayerStore(
    (state) => ({
      isMobilePlayerOpen: state.isMobilePlayerOpen,
      setIsMobilePlayerOpen: state.setIsMobilePlayerOpen,
    })
  );

  const openMobilePlayer = useCallback(() => {
    if (isMobilePlayerOpen) return;

    const url = new URL(window.location.href);

    url.searchParams.set("isMobilePlayerOpen", "true");

    // The reason we don't use router is because the router causes reload on offline mode.
    window.history.pushState({ isMobilePlayerOpen: true }, "", url);
    setIsMobilePlayerOpen(true);
  }, [isMobilePlayerOpen]);

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
          />

          <div className="flex items-center pointer-events-none sm:pointer-events-auto bg-black h-full absolute top-0 right-0 pl-1 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black after:z-[1]">
            <div
              className="hidden sm:flex items-center gap-2 h-full"
              aria-hidden={isMobile}
            >
              <LikeButton song={song} />

              <PlayerTypeButton
                icon={PlayerTypeIcon}
                handleChangePlayerType={handleChangePlayerType}
                playerType={playerType}
              />

              <PlayerOptions song={song} songUrl={songUrl} />
            </div>

            <IoIosArrowUp className="sm:hidden cursor-pointer" size={28} />
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
