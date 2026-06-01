import { useSupabaseClient } from "@/features/supabase/hooks/useSupabaseClient";

export const useLoadImage = (song: Song | null) => {
  const supabaseClient = useSupabaseClient();

  if (!song || !song.img_path) return null;

  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(song.img_path);

  return imageData.publicUrl;
};
