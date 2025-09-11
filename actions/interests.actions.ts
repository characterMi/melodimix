"use server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "./user.actions";

import type { SongWithAuthor } from "@/types";

type GetUserInterestsResponse = {
  error: string | null;
  data: SongWithAuthor[];
};

export const addSongToInterests = async (
  songId: number
): Promise<
  | {
      error: string;
    }
  | {
      error: null;
    }
> => {
  const { user, supabase } = await getCurrentUser();

  if (!user) return { error: "Unauthenticated user." };

  const { error } = await supabase
    .from("interests")
    .insert({ song_id: songId, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/users/${user.id}/interests`);
  revalidatePath("/profile/interests");
  return { error: null };
};

export const deleteInterest = async (songId: number) => {
  const { user, supabase } = await getCurrentUser();

  if (!user) return { error: "Unauthenticated user!" };

  const { error } = await supabase
    .from("interests")
    .delete()
    .eq("user_id", user.id)
    .eq("song_id", songId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/users/${user.id}/interests`);
  revalidatePath("/profile/interests");
  return { error: null };
};

export const getUserInterests = async (
  userId?: string
): Promise<GetUserInterestsResponse> => {
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

const getCurrentUserInterests = async (): Promise<GetUserInterestsResponse> => {
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
