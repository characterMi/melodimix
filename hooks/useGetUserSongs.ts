import type { Song } from "@/types/types";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export const useGetUserSongs = () => {
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [isSongsLoading, setIsSongsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      (async () => {
        setIsSongsLoading(true);

        const { data, error } = await supabaseClient
          .from("songs")
          .select("*")
          .eq("user_id", session?.user.id)
          .order("created_at", { ascending: false });

        if (!error) {
          setUserSongs(data ?? []);
        }

        setIsSongsLoading(false);
      })();
    } else {
      setUserSongs([]);
      setIsSongsLoading(false);
    }
  }, [session]);

  return { isSongsLoading, userSongs };
};
