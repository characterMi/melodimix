import { useEffect, useMemo, useState } from "react";

import { onError } from "@/lib/onError";
import { useSupabaseClient } from "./useSupabaseClient";

import type { Song } from "@/types";

export const useGetSongById = (id?: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSong = async () => {
      setIsLoading(true);

      const { data, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        onError(error.message);
      } else {
        setSong(data as Song);
      }

      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song]
  );
};
