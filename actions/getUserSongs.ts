"use server";

import type { Song } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getUserData } from "./getUserData";

const getCurrentUserSongs = async () => {
  const { supabase, user } = await getUserData();

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", user?.id)
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
  // if no userId is provided, return the current user's songs
  if (!params?.userId) {
    const ownedSongs = await getCurrentUserSongs();

    return ownedSongs;
  }

  const { limit, offset, userId } = params;

  const supabase = createClientComponentClient();

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

    return [];
  }

  if (!data) {
    return [];
  }

  return data;
};
