import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Song } from "@/types/types";

export async function searchForSongs(
  title: string | undefined,
  signal: AbortSignal
): Promise<Song[]> {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false })
    .limit(10)
    .abortSignal(signal);

  if (error) throw error;

  return data;
}
