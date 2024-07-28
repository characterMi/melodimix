"use server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getSongs } from "./getSongs";

export const getSongsByTitle = async (title: string | null) => {
  const supabase = createClientComponentClient();

  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);

    return { error: error.message };
  }

  return (data as any) || [];
};
