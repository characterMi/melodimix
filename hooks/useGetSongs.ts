import { Song } from "@/types/types";
import { useEffect, useState } from "react";

export function useGetSongs(fn: () => Promise<Song[]>) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const songs = await fn();

      setSongs(songs);

      setIsLoading(false);
    })();
  }, []);

  return { songs, isLoading };
}
