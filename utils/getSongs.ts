import type { Song } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getSongs = async (
  limit: number,
  offset: number
): Promise<Song[]> => {
  const supabase = createClientComponentClient();

  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to)
    .limit(limit);

  if (error) {
    console.error(error);
    throw error;
  }

  return (data as any) || [];
};
