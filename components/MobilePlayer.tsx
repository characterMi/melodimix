import { type KeyboardEvent, type RefObject, useCallback, useRef } from "react";

import { GoArrowLeft } from "react-icons/go";
import { TbDots } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLoadImage } from "@/hooks/useLoadImage";

import { createPortal } from "react-dom";
import PlayerOptions from "./PlayerOptions";
import SongCover from "./SongCover";

import type { Song } from "@/types";

const MobilePlayer = ({
  song,
  children,
  songUrl,
  closeMobilePlayerButton,
  isMobilePlayerOpen,
}: {
  song: Song;
  children: React.ReactNode;
  songUrl: string;
  closeMobilePlayerButton: RefObject<HTMLButtonElement>;
  isMobilePlayerOpen: boolean;
}) => {
  const { current: onMobilePlayerClose } = useRef(() => window.history.back());
  const mobilePlayerRef = useRef<HTMLDivElement>(null);
  const songImage = useLoadImage(song);

  useFocusTrap<HTMLDivElement>(mobilePlayerRef, isMobilePlayerOpen);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!isMobilePlayerOpen || e.key !== "Escape") return;

      onMobilePlayerClose();
    },
    [isMobilePlayerOpen]
  );

  return createPortal(
    <div
      className={twMerge(
        "w-full h-sm-screen bg-black fixed top-0 left-0 z-[100] sm:hidden transition duration-300 flex flex-col justify-between items-center overflow-x-hidden overflow-y-auto mobile-player__container",
        isMobilePlayerOpen ? "translate-y-0" : "translate-y-full"
      )}
      ref={mobilePlayerRef}
      aria-hidden={!isMobilePlayerOpen}
      id="mobile-player"
      role="dialog"
      aria-label="Mobile player"
      aria-modal
      onKeyDown={onKeyDown}
    >
      <div className="w-full flex justify-between items-center p-6 xss:p-8">
        <button
          ref={closeMobilePlayerButton}
          className="hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity"
          onClick={onMobilePlayerClose}
          aria-label="Close the mobile player"
        >
          <GoArrowLeft size={32} aria-hidden />
        </button>

        <h2 className="text-2xl text-neutral-200 font-thin">Now playing</h2>

        <PlayerOptions
          song={song}
          songUrl={songUrl}
          triggerEl={<TbDots size={30} aria-hidden />}
        />
      </div>

      {/* Backdrop */}
      {isMobilePlayerOpen && (
        <SongCover
          src={songImage || "/images/liked.png"}
          alt={""}
          aria-hidden
          width={1}
          height={1}
          className="size-full absolute z-[-1] blur-lg"
          renderLoadingComponent={false}
          renderErrorFallback={false}
        />
      )}
      <div
        className="absolute top-0 left-0 w-full h-full z-[-1] bg-[linear-gradient(0deg,black_0%,transparent_75%,rgba(6,95,70,1)_100%)]"
        aria-hidden
      />

      <div className="relative min-h-[250px] max-w-[90vw] aspect-square rounded-xl overflow-hidden bg-black mx-6 xss:mx-8">
        <SongCover
          src={songImage || "/images/liked.png"}
          alt={`Album cover for ${song.title}`}
          width={1000}
          height={1000}
          className="h-full"
          renderLoadingComponent={false}
        />
      </div>

      <div className="w-full flex flex-col gap-4 pb-10 xss:pb-14 p-6 xss:p-8">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default MobilePlayer;
