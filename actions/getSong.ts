"use server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import type { SongWithAuthor } from "@/types";

export const getSong = async (
  songId: string
): Promise<SongWithAuthor | null> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .eq("id", songId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return { ...data, author: data.users.full_name ?? "Guest" };
};
