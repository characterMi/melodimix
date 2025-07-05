"use server";

import type { Song } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getSongs = async (
  limit: number = 20,
  offset: number = 0
): Promise<Song[]> => {
  const supabase = createClientComponentClient();

  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .range(from, to)
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return (
    data.map((song) => ({
      ...song,
      author: song.users.full_name ?? "Guest",
    })) || []
  );
};
