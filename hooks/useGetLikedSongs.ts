import { useLikedSongs } from "@/store/useLikedSongs";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useRef } from "react";

export const useGetLikedSongs = () => {
  const hasFetched = useRef(false);

  const { setLikedSongs, clearLikedSongs } = useLikedSongs((state) => ({
    setLikedSongs: state.setLikedSongs,
    clearLikedSongs: state.clearLikedSongs,
  }));
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();

  useEffect(() => {
    if (!session) {
      clearLikedSongs();
      return;
    }

    if (hasFetched.current) return;

    (async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("song_id")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        data.forEach((item) => {
          setLikedSongs(item.song_id, true);
        });
        hasFetched.current = true;
      }
    })();
  }, [session]);
};
