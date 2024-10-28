import { useEffect, useRef, useState } from "react";
import Slider from "./Slider";

interface DurationProps {
  sound: any;
  duration: number;
}

interface SongDuration {
  minutes: string;
  seconds: string;
}

function Duration({ duration, sound }: DurationProps) {
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

    if (sound) {
      interval = setInterval(() => {
        // sound.seek gives us the current duration (in second)
        setCurrentDurationPercentage((sound.seek() / DURATION_IN_SECOND) * 100);
      }, 1000);

      const seconds = Math.round((duration / 1000) % 60);
      const minutes = Math.round((duration / 1000 - seconds) / 60);

      songDuration.current.seconds =
        seconds < 10 ? `0${seconds}` : seconds.toString();
      songDuration.current.minutes =
        minutes < 10 ? `0${minutes}` : minutes.toString();
    }

    return () => clearInterval(interval);
  }, [sound]);

  useEffect(() => {
    if (sound) {
      const currentSeconds = Math.round(sound.seek() % 60);

      const currentMinutes = Math.round((sound.seek() - currentSeconds) / 60);

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
          if (sound) {
            setCurrentDurationPercentage(value);
            sound.seek(((value / 100) * duration) / 1000);
          }
        }}
        max={100}
        step={1}
      />

      <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black after:pointer-events-none whitespace-nowrap duration-el">
        {minutes} : {seconds}
      </p>
    </div>
  );
}

export default Duration;
