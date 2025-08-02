import { formatDuration } from "@/lib/updateDuration";
import { useEffect, useRef, useState } from "react";

export type Duration =
  | `${number} : ${number}`
  | `0${number} : ${number}`
  | `${number} : 0${number}`
  | `0${number} : 0${number}`;

export function useUpdateDuration(song: HTMLAudioElement | null) {
  const totalDuration = useRef<Duration>("00 : 00");
  const [currentDurationPercentage, setCurrentDurationPercentage] = useState(0);
  const [showTotalDuration, setShowTotalDuration] = useState(true);

  useEffect(() => {
    if (!song) return;

    totalDuration.current = formatDuration(song.duration);

    let lastUpdate = 0;
    const onTimeupdate = (e: Event) => {
      const { currentTime, duration, playbackRate } =
        e.currentTarget as HTMLAudioElement;

      if (!duration) return;

      setCurrentDurationPercentage(currentTime / (duration / 100));

      const now = Date.now();
      if (
        "setPositionState" in navigator.mediaSession &&
        now - lastUpdate > 1000
      ) {
        navigator.mediaSession.setPositionState({
          duration,
          position: currentTime,
          playbackRate: playbackRate || 1.0,
        });

        lastUpdate = now;
      }
    };

    song.addEventListener("timeupdate", onTimeupdate);

    return () => {
      song.removeEventListener("timeupdate", onTimeupdate);
    };
  }, [song]);

  return {
    totalDuration: totalDuration.current,
    currentDurationPercentage,
    setCurrentDurationPercentage,
    showTotalDuration,
    setShowTotalDuration,
    currentDuration: formatDuration(song?.currentTime || 0),
    remaining: formatDuration((song?.duration || 0) - (song?.currentTime || 0)),
  };
}
