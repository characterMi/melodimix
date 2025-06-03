"use server";

import type { Song } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getSongs = async (limit: number = 10): Promise<Song[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
  }

  return (data as any) || [];
};
