"use server";

import type { SongWithAuthor } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getCurrentUser } from "./getCurrentUser";

type ReturnValue = {
  error: string | null;
  data: SongWithAuthor[];
};

const getCurrentUserInterests = async (): Promise<ReturnValue> => {
  const { user, supabase } = await getCurrentUser();

  if (!user) return { error: "Unauthenticated user.", data: [] };

  const { data, error } = await supabase
    .from("interests")
    .select("*, songs(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, data: [] };
  }

  return {
    error: null,
    data: data.map((interest) => interest.songs),
  };
};

export const getUserInterests = async (
  userId?: string
): Promise<ReturnValue> => {
  if (!userId) {
    return getCurrentUserInterests();
  }

  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("interests")
    .select("*, songs(*, users!public_songs_user_id_fkey(full_name))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, data: [] };
  }

  return {
    error: null,
    data: data.map((interest) => ({
      ...interest.songs,
      author: interest.songs.users.full_name,
    })),
  };
};
