"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
    }

    revalidatePath("/");

    return { isLiked: false };
  } else {
    const { error } = await supabaseClient.from("liked_songs").insert({
      song_id: songId,
      user_id: userId,
    });

    if (error) {
      return { error: error.message, isLiked: false };
    }

    revalidatePath("/");

    return { message: "Liked !", isLiked: true };
  }
};
