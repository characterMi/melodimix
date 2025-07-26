import { useUpdateDuration } from "@/hooks/useUpdateDuration";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Slider from "./Slider";

interface DurationProps {
  song: any;
  duration: number;
}

function Duration({ song, duration }: DurationProps) {
  const {
    totalDuration,
    currentDuration,
    currentDurationPercentage,
    showTotalDuration,
    setShowTotalDuration,
    setCurrentDurationPercentage,
    remaining,
  } = useUpdateDuration(song, duration);

  return (
    <div className="w-full h-10 flex items-center justify-center">
      <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:left-full after:top-0 after:bg-gradient-to-r after:from-black after:pointer-events-none z-[1] whitespace-nowrap duration-el">
        {currentDuration}
      </p>

      <Slider
        bgColor="bg-emerald-600"
        value={currentDurationPercentage}
        onChange={(value) => {
          if (song) {
            setCurrentDurationPercentage(value);
            song.seek(((value / 100) * duration) / 1000);
          }
        }}
        max={100}
        step={1}
        label="Song Duration"
      >
        <KeyboardNavigationHelper
          durationPercentage={currentDurationPercentage}
          setDurationPercentage={setCurrentDurationPercentage}
        />
      </Slider>

      <button
        onClick={() => setShowTotalDuration(!showTotalDuration)}
        className="hover:text-neutral-400 focus-visible:text-neutral-400 outline-none transition-colors"
      >
        <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black after:pointer-events-none whitespace-nowrap duration-el">
          <span className={twMerge(showTotalDuration && "opacity-0")}>-</span>

          {showTotalDuration ? totalDuration : remaining}
        </p>
      </button>
    </div>
  );
}

const KeyboardNavigationHelper = ({
  durationPercentage,
  setDurationPercentage,
}: {
  durationPercentage: number;
  setDurationPercentage: Dispatch<SetStateAction<number>>;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          setDurationPercentage((prev) => prev - 1);
        } else if (e.key === "ArrowRight") {
          setDurationPercentage((prev) => prev + 1);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isFocused]);

  return (
    <div
      className={twMerge(
        "absolute top-0 left-0 z-10 h-full w-1 bg-gradient-to-t from-transparent via-green-500 to-transparent opacity-0 transition-opacity outline-none",
        isFocused && "opacity-100"
      )}
      style={{
        left: `${durationPercentage}%`,
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      aria-description="You can use the arrow keys to navigate the song duration"
    />
  );
};

export default Duration;
