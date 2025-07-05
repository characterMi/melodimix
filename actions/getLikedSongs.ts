"use server";

import type { Song } from "@/types";
import { getUserData } from "./getUserData";

export const getLikedSongsWithoutLimit = async () => {
  const { user, supabase } = await getUserData();

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*), users!public_liked_songs_user_id_fkey(full_name)")
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
    author: item.users.full_name ?? "Guest",
  }));
};

export const getLikedSongs = async (
  limit: number = 25,
  offset: number = 0
): Promise<Song[]> => {
  const { user, supabase } = await getUserData();

  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*), users!public_liked_songs_user_id_fkey(full_name)")
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
    author: item.users.full_name ?? "Guest",
  }));
};
