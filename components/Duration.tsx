import { useEffect, useRef, useState } from "react";
import Slider from "./Slider";

interface DurationProps {
  song: any;
  duration: number;
}

interface SongDuration {
  minutes: string;
  seconds: string;
}

function Duration({ duration, song }: DurationProps) {
  const songDuration = useRef<SongDuration>({
    minutes: "00",
    seconds: "00",
  });
  const currentDuration = useRef<SongDuration>({
    minutes: "00",
    seconds: "00",
  });
  const [currentDurationPercentage, setCurrentDurationPercentage] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const DURATION_IN_SECOND = duration / 1000;

    if (song) {
      interval = setInterval(() => {
        // song.seek gives us the current duration (in second)
        setCurrentDurationPercentage((song.seek() / DURATION_IN_SECOND) * 100);
      }, 1000);

      const seconds = Math.round((duration / 1000) % 60);
      const minutes = Math.round((duration / 1000 - seconds) / 60);

      songDuration.current.seconds =
        seconds < 10 ? `0${seconds}` : seconds.toString();
      songDuration.current.minutes =
        minutes < 10 ? `0${minutes}` : minutes.toString();
    }

    return () => clearInterval(interval);
  }, [song]);

  useEffect(() => {
    if (song) {
      const currentSeconds = Math.round(song.seek() % 60);

      const currentMinutes = Math.round((song.seek() - currentSeconds) / 60);

      currentDuration.current.seconds =
        currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds.toString();

      currentDuration.current.minutes =
        currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes.toString();
    }
  }, [currentDurationPercentage]);

  const { minutes, seconds } = songDuration.current;
  const { minutes: currentMinutes, seconds: currentSeconds } =
    currentDuration.current;

  return (
    <div className="w-full h-10 flex items-center justify-center">
      <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:left-full after:top-0 after:bg-gradient-to-r after:from-black after:pointer-events-none z-[1] whitespace-nowrap duration-el">
        {currentMinutes} : {currentSeconds}
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
        label="Duration"
      />

      <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black after:pointer-events-none whitespace-nowrap duration-el">
        {minutes} : {seconds}
      </p>
    </div>
  );
}

export default Duration;
