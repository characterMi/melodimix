"use server";

import type { Playlist } from "@/types";
import { getUserData } from "./getUserData";
import { revalidatePath } from "next/cache";

export const updatePlaylist = async (newData: Playlist) => {
  const { supabase, user } = await getUserData();

  if (!user) {
    return { error: true };
  }

  const { error } = await supabase
    .from("playlists")
    .update(newData)
    .eq("user_id", user.id)
    .eq("id", newData.id);

  if (error) {
    console.error(error);

    return { error: true };
  }

  revalidatePath(`/profile/playlists/${newData.id}`);
  return { error: false };
};
