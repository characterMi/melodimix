"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./getCurrentUser";

export const deletePlaylist = async (playlistId: number, isPublic: boolean) => {
  const { supabase, user } = await getCurrentUser();

  if (!user) return false;

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("user_id", user.id)
    .eq("id", playlistId);

  if (error) {
    console.error(error);

    return false;
  }

  revalidatePath("/profile");
  if (isPublic) {
    revalidatePath(`/users/${user.id}/playlists`);
    revalidatePath(`/users/${user.id}/playlists/${playlistId}`);
  }

  return true;
};
