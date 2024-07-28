"use server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

export const likeSong = async (
  isLiked: boolean,
  userId: string,
  songId: string
) => {
  const supabaseClient = createClientComponentClient();

  if (isLiked) {
    const { error } = await supabaseClient
      .from("liked_songs")
      .delete()
      .eq("user_id", userId)
      .eq("song_id", songId);

    if (error) {
      return { error: error.message, isLiked: true };
    } else {
      revalidatePath("/", "layout");

      return { isLiked: false };
    }
  } else {
    const { error } = await supabaseClient.from("liked_songs").insert({
      song_id: songId,
      user_id: userId,
    });

    if (error) {
      return { error: error.message, isLiked: false };
    } else {
      revalidatePath("/", "layout");

      return { message: "Liked !", isLiked: true };
    }
  }
};
