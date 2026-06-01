import { supabaseClient } from "@/features/supabase/lib/supabaseClient";

export const getPublicPlaylists = async (
  limit: number,
  offset: number,
): Promise<Playlist[]> => {
  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabaseClient
    .from("playlists")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(from, to)
    .limit(limit);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
};
