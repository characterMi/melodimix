"use server";

import type { Playlist } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getCurrentUser } from "./getCurrentUser";
import { getUserById } from "./getUserById";

const getCurrentUsersPlaylists = async () => {
  const { supabase, user } = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);

    return [];
  }

  if (!data) {
    return [];
  }

  return data;
};

export const getUserPlaylists = async (
  userId?: string
): Promise<Playlist[] | { playlists: Playlist[]; author: string }> => {
  if (!userId) {
    return getCurrentUsersPlaylists();
  }

  const supabase = createClientComponentClient();

  const user = await getUserById(userId);

  if (!user) return { playlists: [], author: "Guest" };

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return { playlists: [], author: "Guest" };
  }

  if (!data) {
    return { playlists: [], author: "Guest" };
  }

  return { playlists: data, author: user.name ?? "Guest" };
};
