import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLoadImage } from "@/hooks/useLoadImage";
import { Song } from "@/types";
import { RefObject, useRef } from "react";
import { createPortal } from "react-dom";
import { GoArrowLeft } from "react-icons/go";
import { TbDots } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import PlayerOptions from "./PlayerOptions";
import SongCover from "./SongCover";

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
  const mobilePlayerRef = useRef<HTMLDivElement>(null);
  const songImage = useLoadImage(song);

  useFocusTrap<HTMLDivElement>(mobilePlayerRef, isMobilePlayerOpen);

  return createPortal(
    <div
      className={twMerge(
        "w-full h-sm-screen bg-neutral-900 fixed top-0 left-0 z-[100] sm:hidden transition duration-300 flex flex-col justify-between items-center overflow-x-hidden overflow-y-auto",
        isMobilePlayerOpen ? "translate-y-0" : "translate-y-full"
      )}
      ref={mobilePlayerRef}
      aria-hidden={!isMobilePlayerOpen}
    >
      <div className="w-full flex justify-between items-center p-6 xss:p-8 bg-gradient-to-b from-emerald-800 to-transparent">
        <button
          ref={closeMobilePlayerButton}
          className="hover:opacity-50 focus-visible:opacity-50 outline-none transition-opacity"
          onClick={() => window.history.back()}
          aria-label="Close the mobile player"
        >
          <GoArrowLeft size={32} />
        </button>

        <p className="text-2xl text-neutral-200 font-thin">Now playing</p>

        <PlayerOptions
          song={song}
          songUrl={songUrl}
          triggerEl={<TbDots size={30} aria-label="Options..." />}
        />
      </div>

      {/* Backdrop */}
      {isMobilePlayerOpen && (
        <SongCover
          src={songImage || "/images/liked.png"}
          alt={song.title}
          width={1}
          height={1}
          className="size-full absolute z-[-1] blur-xl"
          renderLoadingComponent={false}
        />
      )}

      <div className="relative min-h-[250px] max-w-[90vw] aspect-square rounded-xl overflow-hidden bg-neutral-900 mx-6 xss:mx-8">
        <SongCover
          src={songImage || "/images/liked.png"}
          alt={song.title}
          width={1000}
          height={1000}
          className="h-full"
          renderLoadingComponent={false}
        />
      </div>

      <div className="w-full flex flex-col gap-4 pb-10 xss:pb-14 p-6 xss:p-8 bg-gradient-to-t from-black to-transparent">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default MobilePlayer;
