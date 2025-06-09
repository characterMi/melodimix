import { formatDuration } from "@/lib/updateDuration";
import { useEffect, useRef, useState } from "react";

export type Duration =
  | `${number} : ${number}`
  | `0${number} : ${number}`
  | `${number} : 0${number}`
  | `0${number} : 0${number}`;

export function useUpdateDuration(song: any, duration: number) {
  const totalDuration = useRef<Duration>("00 : 00");
  const [currentDurationPercentage, setCurrentDurationPercentage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  let currentDuration: Duration = "00 : 00";

  useEffect(() => {
    const DURATION_IN_SECOND = duration / 1000;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      // song.seek gives us the current duration (in second)
      setCurrentDurationPercentage(
        ((song?.seek() || 0) / DURATION_IN_SECOND) * 100
      );
    }, 1000);

    totalDuration.current = formatDuration(DURATION_IN_SECOND);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [song]);

  useEffect(() => {
    navigator.mediaSession?.setPositionState({
      duration: song?.duration() || 0,
      position: song?.seek() || 0,
      playbackRate: 1.0,
    });
  }, [currentDurationPercentage]);

  // We don't want to do this in a useEffect because re-assigning a variable is not going to trigger a re-render plus we don't need another state, we can simply do it in this way.

  currentDuration = formatDuration(song?.seek() || 0);

  return {
    totalDuration: totalDuration.current,
    currentDurationPercentage,
    setCurrentDurationPercentage,
    currentDuration,
  };
}
