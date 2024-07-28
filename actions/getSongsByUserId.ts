"use server";

import type { Song } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createClientComponentClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getUser();

  if (sessionError) {
    console.error(sessionError.message);
    return [];
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
  }

  return (data as any) || [];
};
