"use server";

import type { Playlist } from "@/types";
import { getUserData } from "./getUserData";

export const getUserPlaylists = async (): Promise<{
  playlists: Playlist[];
  isLoggedIn: boolean;
}> => {
  const { supabase, user } = await getUserData();

  if (!user) return { playlists: [], isLoggedIn: false };

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return { playlists: [], isLoggedIn: true };
  }

  if (!data) {
    return { playlists: [], isLoggedIn: true };
  }

  return { playlists: data, isLoggedIn: true };
};
