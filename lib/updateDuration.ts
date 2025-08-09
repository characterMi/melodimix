import type { Duration } from "@/hooks/useSongDuration";

type Seconds = `0${number}` | number;
type Minutes = `0${number}` | number;

export function formatDuration(duration: number): Duration {
  // ~~ is used to round down the number.
  let seconds: Seconds = ~~(duration % 60);
  let minutes: Minutes = ~~((duration - seconds) / 60);

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${minutes} : ${seconds}`;
}
