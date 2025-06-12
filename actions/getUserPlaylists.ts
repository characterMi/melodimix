"use server";

import type { Playlist } from "@/types";
import { getUserData } from "./getUserData";

export const getUserPlaylists = async (): Promise<Playlist[]> => {
  const { supabase, user } = await getUserData();

  if (!user) return [];

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return [];
  }

  if (!data) {
    return [];
  }

  return data;
};
