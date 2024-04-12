"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const likeSong = async (
  isLiked: boolean,
  userId: string,
  songId: string
) => {
  const supabaseClient = createServerComponentClient({
    cookies,
  });

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

      return { message: "Unlike !", isLiked: false };
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
