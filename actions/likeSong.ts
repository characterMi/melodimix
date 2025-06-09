"use server";

import { revalidatePath } from "next/cache";
import { getUserData } from "./getUserData";

export const likeSong = async (
  isLiked: boolean,
  userId: string,
  songId: string
) => {
  const { supabase } = await getUserData();

  if (isLiked) {
    const { error } = await supabase
      .from("liked_songs")
      .delete()
      .eq("user_id", userId)
      .eq("song_id", songId);

    if (error) {
      return { error: error.message, isLiked: true };
    }

    revalidatePath("/liked");
    revalidatePath("/profile/liked");

    return { isLiked: false };
  }

  const { error } = await supabase.from("liked_songs").insert({
    song_id: songId,
    user_id: userId,
  });

  if (error) {
    return { error: error.message, isLiked: false };
  }

  revalidatePath("/liked");
  revalidatePath("/profile/liked");

  return { message: "Liked !", isLiked: true };
};
