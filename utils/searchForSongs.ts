import type { Song } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function searchForSongs(
  searchValue: string | undefined,
  signal: AbortSignal
): Promise<Song[]> {
  if (
    typeof searchValue !== "string" ||
    !searchValue ||
    searchValue.length > 50
  )
    return [];

  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .or(`title.ilike.%${searchValue}%,artist.ilike.%${searchValue}%`)
    .order("created_at", { ascending: false })
    .limit(10)
    .abortSignal(signal);

  if (error) throw error;

  return data.map((song) => ({
    ...song,
    author: song.users.full_name ?? "Guest",
  }));
}
