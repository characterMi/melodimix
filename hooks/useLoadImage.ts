import type { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useLoadImage = (song: Song | null) => {
  const supabaseClient = useSupabaseClient();

  if (!song) return null;

  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(song.img_path);

  return imageData.publicUrl;
};
