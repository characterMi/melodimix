import { useUserSongs } from "@/store/useUserSongsStore";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useRef, useState } from "react";

export const useGetUserSongs = () => {
  const hasFetched = useRef(false);

  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();
  const { userSongs, setUserSongs } = useUserSongs();
  const [isSongsLoading, setIsSongsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      // The useEffect runs every time the focus event happens on window, we're doing this to make sure we don't trigger a request every time the focus state changes.
      if (hasFetched.current) return;

      (async () => {
        setIsSongsLoading(true);

        const { data, error } = await supabaseClient
          .from("songs")
          .select("*")
          .eq("user_id", session?.user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (!error) {
          setUserSongs(data ?? []);
        }

        hasFetched.current = true;
        setIsSongsLoading(false);
      })();
    } else {
      setUserSongs([]);
      setIsSongsLoading(false);
    }
  }, [session]);

  return { isSongsLoading, userSongs };
};
