import { useUpdateDuration } from "@/hooks/useUpdateDuration";
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
    setCurrentDurationPercentage,
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
        label="Duration"
      />

      <p className="relative bg-black px-2 after:w-5 after:h-full after:absolute after:right-full after:top-0 after:bg-gradient-to-l after:from-black after:pointer-events-none whitespace-nowrap duration-el">
        {totalDuration}
      </p>
    </div>
  );
}

export default Duration;
