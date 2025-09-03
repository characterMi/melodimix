"use server";

import type { SongWithAuthor } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getSongs = async (
  limit: number = 20
): Promise<SongWithAuthor[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .order("created_at", { ascending: false })
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
