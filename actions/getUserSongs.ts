"use server";

import type { Song } from "@/types";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getUserData } from "./getUserData";

const getCurrentUserSongs = async (
  supabase: SupabaseClient,
  currentUserId: string | undefined
) => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", currentUserId)
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

type Params = {
  userId: string;
  limit: number;
  offset: number;
} | null;

export const getUserSongs = async (params: Params): Promise<Song[]> => {
  const { supabase, user } = await getUserData();

  // if no userId is provided, return the current user's songs
  if (!params?.userId) {
    const ownedSongs = await getCurrentUserSongs(
      supabase,
      /* current user */ user?.id
    );

    return ownedSongs;
  }

  const { limit, offset, userId } = params;

  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId)
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

  return data;
};
