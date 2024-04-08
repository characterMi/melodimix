import { useEffect, useState } from "react";
import Slider from "./Slider";

interface DurationProps {
  sound: any;
  duration: number;
}

function Duration({ duration, sound }: DurationProps) {
  const [currentDuration, setCurrentDuration] = useState(0);

  useEffect(() => {
    let interval: any;

    if (sound) {
      interval = setInterval(() => {
        setCurrentDuration((sound.seek() / (duration / 1000)) * 100);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sound]);

  let currentSeconds;

  let currentMinutes;

  let seconds;

  let minutes;

  if (sound) {
    currentSeconds = Math.round(sound.seek() % 60);

    currentMinutes = Math.round((sound.seek() - currentSeconds) / 60);

    seconds = Math.round((duration / 1000) % 60);

    minutes = Math.round((duration / 1000 - seconds) / 60);

    currentSeconds =
      currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds;

    currentMinutes =
      currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;

    seconds = seconds < 10 ? `0${seconds}` : seconds;

    minutes = minutes < 10 ? `0${minutes}` : minutes;
  }

  return (
    <div className="w-full h-10 flex items-center justify-center">
      <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:left-full after:top-0 after:bg-gradient-to-r after:from-black z-[1] whitespace-nowrap">
        {!currentMinutes ? "00" : currentMinutes} :{" "}
        {!currentSeconds ? "00" : currentSeconds}
      </p>

      <Slider
        bgColor="bg-emerald-600"
        value={currentDuration}
        onChange={(value) => {
          if (sound) {
            setCurrentDuration(value);
            sound.seek(((value / 100) * duration) / 1000);
          }
        }}
        max={100}
        step={1}
      />

      <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black whitespace-nowrap">
        {!minutes ? "00" : minutes} : {!seconds ? "00" : seconds}
      </p>
    </div>
  );
}

export default Duration;
