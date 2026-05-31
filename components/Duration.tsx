import { defaultColors } from "@/constants";
import { useSongDuration } from "@/hooks/useSongDuration";
import { shouldReduceMotion } from "@/lib/reduceMotion";
import { ColorEntity } from "@/store/useSongColors";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Slider from "./Slider";

function Duration({
  song,
  isMobilePlayer,
  hasShortcut,
  colors,
}: {
  song: HTMLAudioElement | null;
  isMobilePlayer?: true;
  hasShortcut?: true;
  colors?: ColorEntity;
}) {
  const {
    currentDuration,
    currentDurationPercentage,
    showTotalDuration,
    totalDuration,
    remaining,
    setCurrentDurationPercentage,
    setShowTotalDuration,
  } = useSongDuration(song);

  return (
    <div className="w-full h-[40px] flex items-center justify-center z-[1]">
      <p
        className={twMerge(
          "relative pr-3 z-[1] whitespace-nowrap number-text",
          !isMobilePlayer &&
            "bg-black pl-2 after:w-5 after:h-full after:absolute after:left-full after:top-0 after:bg-gradient-to-r after:from-black after:pointer-events-none",
        )}
      >
        {currentDuration}
      </p>

      <Slider
        bgColor={colors?.light ?? defaultColors.light}
        value={currentDurationPercentage}
        onChange={(value) => {
          if (!song) return;

          setCurrentDurationPercentage(value);
          const newTime = value * ((song.duration || 0) / 100);
          song.currentTime = newTime;

          navigator.mediaSession?.setPositionState?.({
            duration: song.duration,
            playbackRate: song.playbackRate,
            position: newTime,
          });
        }}
        max={100}
        step={1}
        label="Song Duration"
      >
        <KeyboardNavigationHelper
          song={song}
          color={colors?.medium ?? "#22c55e"}
          durationPercentage={currentDurationPercentage}
          setDurationPercentage={setCurrentDurationPercentage}
          id={hasShortcut ? "duration-navigator" : undefined}
        />
      </Slider>

      <button
        onClick={() => setShowTotalDuration(!showTotalDuration)}
        type="button"
        className={twMerge(
          "hover:text-neutral-400 focus-visible:text-neutral-400 outline-none",
          !shouldReduceMotion && "transition-opacity",
        )}
        aria-label={"Show " + (showTotalDuration ? "Remaining" : "Total")}
      >
        <p
          className={twMerge(
            "relative pl-2 z-[1] whitespace-nowrap number-text",
            !isMobilePlayer &&
              "bg-black px-2 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black after:pointer-events-none",
          )}
        >
          <span className={twMerge(showTotalDuration && "opacity-0")}>-</span>

          {showTotalDuration ? totalDuration : remaining}
        </p>
      </button>
    </div>
  );
}

const KeyboardNavigationHelper = ({
  song,
  durationPercentage,
  color,
  setDurationPercentage,
  id,
}: {
  song: HTMLAudioElement | null;
  color: string;
  durationPercentage: number;
  setDurationPercentage: Dispatch<SetStateAction<number>>;
  id?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!song) return;

      const power = e.ctrlKey ? 10 : 0.1;

      const updateDuration = (
        currDuration: number,
        type: "forward" | "backward",
      ) => {
        const pos =
          type === "backward"
            ? Math.max(currDuration - power, 0)
            : Math.min(currDuration + power, 100);
        const newTime = pos * ((song.duration || 0) / 100);

        song.currentTime = newTime;

        navigator.mediaSession?.setPositionState?.({
          duration: song.duration,
          playbackRate: song.playbackRate,
          position: newTime,
        });

        return pos;
      };

      if (e.key === "ArrowLeft") {
        setDurationPercentage((prev) => updateDuration(prev, "backward"));
      } else if (e.key === "ArrowRight") {
        setDurationPercentage((prev) => updateDuration(prev, "forward"));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused]);

  return (
    <div
      className={twMerge(
        "absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 size-2 rounded-full hover:opacity-50 focus-visible:scale-125 active:scale-125 cursor-pointer outline-none",
        !shouldReduceMotion && "transition",
      )}
      style={{
        left: `${durationPercentage}%`,
        background: color,
      }}
      id={id}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      aria-description="You can use the arrow keys to navigate the song duration (hold the CTRL key to seek faster)"
    />
  );
};

export default Duration;
