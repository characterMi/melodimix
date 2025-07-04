"use server";

import { revalidatePath } from "next/cache";
import { getUserData } from "./getUserData";

export const likeSong = async (
  isLiked: boolean,
  songId: string
): Promise<{ isLiked: boolean; error?: string; message?: string }> => {
  const { supabase, user } = await getUserData();

  if (!user) {
    return { error: "User not found", isLiked };
  }

  if (isLiked) {
    const { error } = await supabase
      .from("liked_songs")
      .delete()
      .eq("user_id", user.id)
      .eq("song_id", songId);

    if (error) {
      return { error: error.message, isLiked };
    }

    revalidatePath("/liked");
    revalidatePath("/profile/liked");

    return { isLiked: false };
  }

  const { error } = await supabase.from("liked_songs").insert({
    song_id: songId,
    user_id: user.id,
  });

  if (error) {
    return { error: error.message, isLiked };
  }

  revalidatePath("/liked");
  revalidatePath("/profile/liked");

  return { message: "Liked !", isLiked: true };
};
