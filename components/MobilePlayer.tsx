import {
  type KeyboardEvent,
  type RefObject,
  type TouchEvent,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { GoArrowLeft } from "react-icons/go";
import { twMerge } from "tailwind-merge";

import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLoadImage } from "@/hooks/useLoadImage";
import { shouldReduceMotion } from "@/lib/reduceMotion";

import SongCover from "./SongCover";
import SongOptions from "./SongOptions";

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
  const dragPosInfo = useRef({ start: 0, current: 0 });
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

  const onDragStart = useCallback(({ touches }: TouchEvent<HTMLDivElement>) => {
    if (!mobilePlayerRef.current) return;

    dragPosInfo.current.start = touches[0].clientY;
    mobilePlayerRef.current.style.transition = "none";
  }, []);

  const onDrag = useCallback(({ touches }: TouchEvent<HTMLDivElement>) => {
    if (!mobilePlayerRef.current) return;

    const dragPos = Math.max(
      0,
      Math.min(
        window.innerHeight,
        touches[0].clientY - dragPosInfo.current.start
      )
    );

    dragPosInfo.current.current = dragPos;

    mobilePlayerRef.current.style.transform = `translateY(${dragPos}px)`;
  }, []);

  const onDragEnd = useCallback(() => {
    if (!mobilePlayerRef.current) return;

    mobilePlayerRef.current.style.removeProperty("transition");
    mobilePlayerRef.current.style.removeProperty("transform");

    if (dragPosInfo.current.current > window.innerHeight / 3) {
      onMobilePlayerClose();
    }
  }, []);

  return createPortal(
    // @ts-ignore
    <div
      className={twMerge(
        "w-full h-sm-screen bg-gradient-to-t from-black to-emerald-800 fixed top-0 left-0 z-[100] sm:hidden flex flex-col justify-between items-center overflow-x-hidden overflow-y-auto mobile-player__container",
        isMobilePlayerOpen ? "translate-y-0" : "translate-y-full",
        !shouldReduceMotion && "transition-transform duration-300"
      )}
      ref={mobilePlayerRef}
      aria-hidden={!isMobilePlayerOpen}
      id="mobile-player"
      role="dialog"
      aria-label="Mobile player"
      aria-modal
      onKeyDown={onKeyDown}
      {...(isMobilePlayerOpen ? {} : { inert: "true" })}
    >
      <div className="w-full flex justify-between items-center p-6 xss:p-8">
        <button
          ref={closeMobilePlayerButton}
          className={twMerge(
            "hover:opacity-50 z-[1] focus-visible:opacity-50 outline-none",
            !shouldReduceMotion && "transition-opacity"
          )}
          onClick={onMobilePlayerClose}
          aria-label="Close the mobile player"
        >
          <GoArrowLeft size={32} aria-hidden />
        </button>

        <h2 className="text-2xl text-neutral-200 font-thin">Now playing</h2>

        <SongOptions
          song={song}
          songUrl={songUrl}
          triggerClasses="rotate-90 z-[1]"
          triggerSize={30}
        />
      </div>

      {/* Backdrop */}
      <SongCover
        src={songImage || "/images/liked.png"}
        alt={""}
        aria-hidden
        width={1}
        height={1}
        className={twMerge(
          "size-full absolute z-[-1]",
          isMobilePlayerOpen && "blur-lg"
        )}
        renderErrorFallback={false}
      />
      <div
        className="absolute top-0 left-0 w-full h-full z-[-1] bg-gradient-to-t from-black from-0% via-transparent via-75% to-emerald-800 to-100%"
        aria-hidden
      />

      <div className="relative min-h-[250px] max-w-[90vw] aspect-square rounded-xl overflow-hidden bg-black mx-6 xss:mx-8">
        <SongCover
          src={songImage || "/images/liked.png"}
          alt={`Album cover for ${song.title}`}
          width={1000}
          height={1000}
          className="h-full shadow-2xl"
        />
      </div>

      <div className="w-full flex flex-col gap-4 pb-14 p-6 xss:p-8">
        {children}
      </div>

      <div
        onTouchStart={onDragStart}
        onTouchMove={onDrag}
        onTouchEnd={onDragEnd}
        className="size-full absolute top-0 left-0"
        aria-label="Drag to close the Mobile player (Touch devices only)"
      />
    </div>,
    document.body
  );
};

export default MobilePlayer;
