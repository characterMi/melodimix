import { formatDuration } from "@/lib/updateDuration";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import Slider from "./Slider";

export type Duration =
  | `${number} : ${number}`
  | `0${number} : ${number}`
  | `${number} : 0${number}`
  | `0${number} : 0${number}`;

function Duration({
  song,
  isMobilePlayer,
}: {
  song: HTMLAudioElement | null;
  isMobilePlayer?: true;
}) {
  const { currentDurationPercentage, setCurrentDurationPercentage } =
    usePlayerStore((state) => ({
      currentDurationPercentage: state.durationPercentage,
      setCurrentDurationPercentage: state.setCurrentDurationPercentage,
    }));

  const totalDuration = useMemo<Duration>(
    () => formatDuration(song?.duration ?? 0),
    [song]
  );
  const [showTotalDuration, setShowTotalDuration] = useState(true);

  const currentDuration = formatDuration(song?.currentTime || 0);
  const remaining = formatDuration(
    (song?.duration || 0) - (song?.currentTime || 0)
  );

  return (
    <div className="w-full h-10 flex items-center justify-center">
      <p
        className={twMerge(
          "relative pr-3 z-[1] whitespace-nowrap duration-el",
          !isMobilePlayer &&
            "bg-black pl-2 after:w-5 after:h-full after:absolute after:left-full after:top-0 after:bg-gradient-to-r after:from-black after:pointer-events-none"
        )}
      >
        {currentDuration}
      </p>

      <Slider
        bgColor="bg-emerald-600"
        value={currentDurationPercentage}
        onChange={(value) => {
          if (song) {
            setCurrentDurationPercentage(value);
            song.currentTime = value * ((song.duration || 0) / 100);
          }
        }}
        max={100}
        step={1}
        label="Song Duration"
      >
        <KeyboardNavigationHelper
          song={song}
          durationPercentage={currentDurationPercentage}
          setDurationPercentage={setCurrentDurationPercentage}
        />
      </Slider>

      <button
        onClick={() => setShowTotalDuration(!showTotalDuration)}
        className="hover:text-neutral-400 focus-visible:text-neutral-400 outline-none transition-colors"
        aria-label={"Show " + (showTotalDuration ? "Remaining" : "Total")}
      >
        <p
          className={twMerge(
            "relative pl-2 z-[1] whitespace-nowrap duration-el",
            !isMobilePlayer &&
              "bg-black px-2 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black after:pointer-events-none"
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
  setDurationPercentage,
}: {
  song: HTMLAudioElement | null;
  durationPercentage: number;
  setDurationPercentage: (value: number | ((prev: number) => number)) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!song) return;

      const power = e.ctrlKey ? 10 : 0.1;

      if (e.key === "ArrowLeft") {
        setDurationPercentage((prev) => {
          const pos = Math.max(prev - power, 0);

          song.currentTime = pos * ((song.duration || 0) / 100);

          return pos;
        });
      } else if (e.key === "ArrowRight") {
        setDurationPercentage((prev) => {
          const pos = Math.min(prev + power, 100);

          song.currentTime = pos * ((song.duration || 0) / 100);

          return pos;
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused]);

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 size-2 rounded-full bg-green-500 transition hover:opacity-50 focus-visible:scale-125 active:scale-125 cursor-pointer outline-none"
      style={{
        left: `${durationPercentage}%`,
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      aria-description="You can use the arrow keys to navigate the song duration (hold the CTRL key to seek faster)"
    />
  );
};

export default Duration;
