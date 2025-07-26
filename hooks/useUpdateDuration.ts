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
  const [showTotalDuration, setShowTotalDuration] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

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

  return {
    totalDuration: totalDuration.current,
    currentDurationPercentage,
    setCurrentDurationPercentage,
    showTotalDuration,
    setShowTotalDuration,
    currentDuration: formatDuration(song?.seek() || 0),
    remaining: formatDuration(duration / 1000 - (song?.seek() || 0)),
  };
}
