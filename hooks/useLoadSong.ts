import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const useLoadSong = (songUrl: string) => {
  const hasFetched = useRef(false);
  const abortController = useRef<AbortController | null>(null);

  const [isSoundLoading, setIsSoundLoading] = useState(true);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    if (hasFetched.current) return;

    abortController.current?.abort();
    abortController.current = new AbortController();

    async function getSong() {
      const cache = await caches.open("songs");
      const cachedResponse = await cache.match(songUrl);

      if (cachedResponse) return cachedResponse.clone();

      const response = await fetch(songUrl, {
        signal: abortController.current!.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load the song: ${response.status} ${response.statusText}`
        );
      }

      cache.put(songUrl, response.clone()).catch((err) => console.error(err));
      return response;
    }

    (async () => {
      try {
        setIsSoundLoading(true);

        const response = await getSong();

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
        if (error instanceof DOMException && error?.name === "AbortError")
          return;

        console.error(error);
        toast.error(errorText);
      } finally {
        setIsSoundLoading(false);
      }
    })();

    return () => {
      abortController.current?.abort();
      hasFetched.current = false;
      audioSrc && URL.revokeObjectURL(audioSrc);
    };
  }, [songUrl]);

  return { isSoundLoading, audioSrc };
};
