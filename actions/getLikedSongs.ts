"use server";

import type { Song } from "@/types";
import { getCurrentUser } from "./getCurrentUser";

export const getLikedSongsWithoutLimit = async () => {
  const { user, supabase } = await getCurrentUser();

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

export const getLikedSongs = async (
  limit: number = 25,
  offset: number = 0
): Promise<Song[]> => {
  const { user, supabase } = await getCurrentUser();

  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .range(from, to)
    .limit(limit);

  if (error) {
    console.error(error);

    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.songs,
  }));
};
