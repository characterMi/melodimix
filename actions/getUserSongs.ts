"use server";

import type { Song } from "@/types";
import { getUserData } from "./getUserData";

export const getUserSongs = async (): Promise<Song[]> => {
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
