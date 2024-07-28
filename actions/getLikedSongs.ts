"use server";

import type { Song } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createClientComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.songs,
  }));
};
