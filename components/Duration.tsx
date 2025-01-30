import { useEffect, useRef, useState } from "react";
import Slider from "./Slider";

interface DurationProps {
  song: any;
  duration: number;
}

function Duration({ duration, song }: DurationProps) {
  const songDuration = useRef<string>("00 : 00");
  const [currentDurationPercentage, setCurrentDurationPercentage] = useState(0);

  useEffect(() => {
    const DURATION_IN_SECOND = duration / 1000;
    const interval = setInterval(() => {
      // song.seek gives us the current duration (in second)
      setCurrentDurationPercentage(
        ((song?.seek() || 0) / DURATION_IN_SECOND) * 100
      );
    }, 1000);

    let seconds: string | number = ~~(DURATION_IN_SECOND % 60);
    let minutes: string | number = ~~((DURATION_IN_SECOND - seconds) / 60);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    songDuration.current = `${minutes} : ${seconds}`;

    return () => clearInterval(interval);
  }, [song]);

  return (
    <div className="w-full h-10 flex items-center justify-center">
      <CurrentDuration
        currentDuration={song?.seek() || 0}
        currentDurationPercentage={currentDurationPercentage}
        song={song}
      />

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
        {songDuration.current}
      </p>
    </div>
  );
}

function CurrentDuration({
  currentDuration,
  currentDurationPercentage,
  song,
}: {
  currentDuration: number;
  currentDurationPercentage: number;
  song: any;
}) {
  const [duration, setDuration] = useState("00 : 00");

  useEffect(() => {
    const currentSeconds = ~~(currentDuration % 60);
    const currentMinutes = ~~((currentDuration - currentSeconds) / 60);

    setDuration(
      `${
        currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes.toString()
      } : ${
        currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds.toString()
      }`
    );

    navigator.mediaSession?.setPositionState({
      duration: song.duration(),
      position: song.seek(),
      playbackRate: 1.0,
    });
  }, [currentDurationPercentage]);

  return (
    <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:left-full after:top-0 after:bg-gradient-to-r after:from-black after:pointer-events-none z-[1] whitespace-nowrap duration-el">
      {duration}
    </p>
  );
}

export default Duration;
