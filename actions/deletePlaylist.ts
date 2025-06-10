"use server";

import { revalidatePath } from "next/cache";
import { getUserData } from "./getUserData";

export const deletePlaylist = async (playlistId: string) => {
  const { supabase, user } = await getUserData();

  if (!user) {
    return { error: "User not found" };
  }

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("user_id", user.id)
    .eq("id", playlistId);

  if (error) {
    console.error(error);

    return { error: "Something went wrong." };
  }

  revalidatePath("/profile");

  return { error: null };
};
