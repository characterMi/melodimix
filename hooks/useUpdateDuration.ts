import { formatDuration } from "@/lib/updateDuration";
import { useEffect, useRef, useState } from "react";

export type Duration =
  | `${number} : ${number}`
  | `0${number} : ${number}`
  | `${number} : 0${number}`
  | `0${number} : 0${number}`;

export function useUpdateDuration(song: any) {
  const totalDuration = useRef<Duration>("00 : 00");
  const [currentDurationPercentage, setCurrentDurationPercentage] = useState(0);
  const [showTotalDuration, setShowTotalDuration] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!song) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      // song.seek gives us the current duration (in second)
      setCurrentDurationPercentage((song.seek() / song._duration) * 100);
    }, 1000);

    totalDuration.current = formatDuration(song._duration);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [song]);

  useEffect(() => {
    if (!song) return;

    navigator.mediaSession?.setPositionState({
      duration: song._duration,
      position: song.seek(),
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
    remaining: formatDuration((song?._duration || 0) - (song?.seek() || 0)),
  };
}
