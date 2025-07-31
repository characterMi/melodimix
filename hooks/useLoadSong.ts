import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const useLoadSong = (songUrl: string) => {
  const hasFetched = useRef(false);
  const abortController = useRef<AbortController | null>(null);

  const [isSoundLoading, setIsSoundLoading] = useState(true);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    if (hasFetched.current) return;

    const abortReason = {
      code: "499",
      message: "User Aborted the request",
    };

    abortController.current?.abort(abortReason);
    abortController.current = new AbortController();

    (async () => {
      try {
        setIsSoundLoading(true);

        const response = await fetch(songUrl, {
          signal: abortController.current!.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load the song: ${response.status} ${response.statusText}`
          );
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioSrc((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        hasFetched.current = true;
      } catch (error) {
        const errorText = "Couldn't load the music";

        console.error(`${errorText}: ${error}`);
        if ((error as any)?.code === "499") return;

        console.error(error);
        toast.error(errorText);
      } finally {
        setIsSoundLoading(false);
      }
    })();

    return () => {
      abortController.current?.abort(abortReason);
      hasFetched.current = false;
      audioSrc && URL.revokeObjectURL(audioSrc);
    };
  }, [songUrl]);

  return { isSoundLoading, audioSrc };
};
