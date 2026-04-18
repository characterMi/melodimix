import { type KeyboardEvent, useCallback, useEffect, useRef } from "react";
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
  isMobilePlayerOpen,
  openMobilePlayerButton,
}: {
  song: Song;
  children: React.ReactNode;
  songUrl: string;
  isMobilePlayerOpen: boolean;
  openMobilePlayerButton: React.RefObject<HTMLButtonElement>;
}) => {
  const dragStartPosition = useRef(0);

  const onMobilePlayerClose = () =>
    mobilePlayerRef.current?.classList.add("slide-down");
  const songImage = useLoadImage(song);
  const mobilePlayerRef = useRef<HTMLDivElement>(null);

  useFocusTrap<HTMLDivElement>(mobilePlayerRef, isMobilePlayerOpen);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!isMobilePlayerOpen || e.key !== "Escape") return;

      onMobilePlayerClose();
    },
    [isMobilePlayerOpen]
  );

  useEffect(() => {
    const mobilePlayerRefCurrent = mobilePlayerRef.current;
    if (!mobilePlayerRefCurrent) return;

    const onAnimationFinish = (e: AnimationEvent) => {
      if (e.animationName === "slideUp") {
        (e.currentTarget as HTMLDivElement).classList.remove("slide-up");
      }

      if (e.animationName === "slideDown") {
        window.history.back();
      }
    };

    mobilePlayerRefCurrent.addEventListener("animationend", onAnimationFinish);

    return () => {
      mobilePlayerRefCurrent.removeEventListener(
        "animationend",
        onAnimationFinish
      );
      openMobilePlayerButton.current?.focus();
    };
  }, []);

  return createPortal(
    <div
      className={twMerge(
        "w-full h-sm-screen bg-gradient-to-t from-black to-emerald-800 fixed top-0 left-0 z-[100] sm:hidden flex flex-col justify-between items-center overflow-x-hidden overflow-y-auto select-none mobile-player__container",
        !shouldReduceMotion && "slide-up"
      )}
      ref={mobilePlayerRef}
      id="mobile-player"
      role="dialog"
      aria-label="Mobile player"
      aria-modal
      onKeyDown={onKeyDown}
    >
      <div className="w-full flex justify-between items-center p-6 xss:p-8">
        <button
          className={twMerge(
            "hover:opacity-50 focus-visible:opacity-50 outline-none z-[1]",
            !shouldReduceMotion && "transition-opacity"
          )}
          autoFocus
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

      <div className="w-full flex flex-col gap-4 pb-14 p-6 xss:p-8 z-[1]">
        {children}
      </div>

      <div
        className="size-full absolute top-0 left-0 cursor-grab pointer-events-auto"
        onDragStart={(e) => {
          e.currentTarget.style.setProperty("cursor", "grabbing");
          dragStartPosition.current = e.clientY;
        }}
        onDrag={(e) => {
          const progress = Math.max(0, e.clientY - dragStartPosition.current);

          mobilePlayerRef.current?.style.setProperty(
            "transform",
            `translate(0, ${progress}px)`
          );
        }}
        onDragEnd={(e) => {
          e.currentTarget.style.setProperty("cursor", "grab");
          if (e.clientY > window.innerHeight / 3) {
            onMobilePlayerClose();
          } else {
            mobilePlayerRef.current?.classList.add("slide-up");
          }
        }}
        aria-label="Hold and Drag to close the mobile player"
      />
    </div>,
    document.body
  );
};

export default MobilePlayer;
