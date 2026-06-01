import { useSupabaseClient } from "@/features/supabase/hooks/useSupabaseClient";

export const useLoadSongUrl = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song || !song.song_path) {
    return "";
  }

  const { data: songData } = supabaseClient.storage
    .from("songs")
    .getPublicUrl(song.song_path);

  return songData.publicUrl;
};
