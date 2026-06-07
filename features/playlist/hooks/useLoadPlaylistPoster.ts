import { useSupabaseClient } from "@/features/supabase/hooks/useSupabaseClient";

export const useLoadPlaylistPoster = (playlist: Playlist | undefined) => {
  const supabaseClient = useSupabaseClient();

  if (!playlist || !playlist.poster_path) return null;

  const { data: imageData } = supabaseClient.storage
    .from("playlist_posters")
    .getPublicUrl(playlist.poster_path);

  return imageData.publicUrl;
};
