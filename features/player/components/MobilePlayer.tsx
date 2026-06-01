"use client";

import { type KeyboardEvent, type RefObject, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { GoArrowLeft } from "react-icons/go";
import { twMerge } from "tailwind-merge";

import { useLoadImage } from "@/features/song-related/hooks/useLoadImage";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { useMobilePlayerDrag } from "../hooks/useMobilePlayerDrag";

import SongCover from "@/features/song-related/components/SongCover";
import SongOptions from "./SongOptions";

const MobilePlayer = ({
  song,
  children,
  songUrl,
  closeMobilePlayerButton,
  isMobilePlayerOpen,
  color,
  defaultColor,
}: {
  song: Song;
  children: React.ReactNode;
  songUrl: string;
  closeMobilePlayerButton: RefObject<HTMLButtonElement>;
  isMobilePlayerOpen: boolean;
  color: string;
  defaultColor: string;
}) => {
  const contentContainer = useRef<HTMLDivElement>(null);
  const mobilePlayerRef = useRef<HTMLDivElement>(null);
  const songImage = useLoadImage(song);

  const { onDrag, onDragEnd, onDragStart } = useMobilePlayerDrag(
    mobilePlayerRef,
    contentContainer,
    color,
    defaultColor,
  );

  useFocusTrap<HTMLDivElement>(mobilePlayerRef, isMobilePlayerOpen);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!isMobilePlayerOpen || e.key !== "Escape") return;

      window.history.back();
    },
    [isMobilePlayerOpen],
  );

  return createPortal(
    // @ts-ignore
    <div
      className={twMerge(
        "w-full h-sm-screen fixed top-0 left-0 z-[100] overflow-hidden sm:hidden",
        isMobilePlayerOpen ? "translate-y-0" : "translate-y-full",
        !shouldReduceMotion && "transition duration-300",
      )}
      style={{
        background: `linear-gradient(0deg, #000000, ${color})`,
      }}
      ref={mobilePlayerRef}
      aria-hidden={!isMobilePlayerOpen}
      id="mobile-player"
      role="dialog"
      aria-label="Mobile player"
      aria-modal
      onKeyDown={onKeyDown}
      {...(isMobilePlayerOpen ? {} : { inert: "true" })}
    >
      {/* Backdrop */}
      <SongCover
        src={songImage || "/images/song.png"}
        alt={""}
        aria-hidden
        width={1}
        height={1}
        className={twMerge(
          "size-full absolute z-[-1] opacity-50",
          isMobilePlayerOpen && "blur-lg",
        )}
        renderErrorFallback={false}
      />
      <div
        className={twMerge(
          "absolute top-0 left-0 w-full h-full z-[-1]",
          !shouldReduceMotion && "transition duration-300",
        )}
        aria-hidden
        style={{
          background: `linear-gradient(0deg, #000000 0%, transparent 75%, ${color} 100%)`,
        }}
      />

      <div
        className="size-full flex flex-col justify-between items-center relative overflow-x-hidden overflow-y-auto"
        ref={contentContainer}
      >
        <div className="w-full flex justify-between items-center p-6 xss:p-8">
          <button
            ref={closeMobilePlayerButton}
            className={twMerge(
              "hover:opacity-50 z-[1] focus-visible:opacity-50 outline-none",
              !shouldReduceMotion && "transition-opacity",
            )}
            onClick={() => window.history.back()}
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

        <div className="relative min-h-[250px] max-w-[90vw] aspect-square rounded-xl overflow-hidden bg-black mx-6 xss:mx-8">
          <SongCover
            src={songImage || "/images/song.png"}
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
          onPointerDown={onDragStart}
          onTouchMove={onDrag}
          onMouseMove={onDrag}
          onTouchEnd={onDragEnd}
          onMouseUp={onDragEnd}
          className="size-full absolute top-0 left-0 cursor-grab"
          aria-label="Drag to close the Mobile player"
        />
      </div>
    </div>,
    document.body,
  );
};

export default MobilePlayer;
