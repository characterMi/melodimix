"use server";

import { removeDuplicatedSpaces } from "@/lib/removeDuplicatedSpaces";
import type { PlaylistWithoutCreatedAt } from "@/types";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./getCurrentUser";

export const updatePlaylist = async (
  newData: PlaylistWithoutCreatedAt
): Promise<
  { error: true; message: string } | { error: false; message: null }
> => {
  const { supabase, user } = await getCurrentUser();
  const trimmedName = newData.name.trim();

  if (!user) {
    return { error: true, message: "Unauthenticated User." };
  }

  if (typeof trimmedName !== "string") {
    return { error: true, message: "Playlist name is required!" };
  }

  if (trimmedName.length > 50 || trimmedName.length < 3) {
    return { error: true, message: "Playlist name is too long or too short!" };
  }

  if (newData.song_ids.length > 100) {
    return {
      error: true,
      message:
        "Too many songs in this playlist, you can't add more than 100 songs to a playlist.",
    };
  }

  const { error } = await supabase
    .from("playlists")
    .update({ ...newData, name: removeDuplicatedSpaces(trimmedName) })
    .eq("user_id", user.id)
    .eq("id", newData.id);

  if (error) {
    console.error(error);

    return {
      error: true,
      message: "Something went wrong while updating the playlist!",
    };
  }

  revalidatePath(`/profile/playlists/${newData.id}`);
  if (newData.is_public) {
    revalidatePath(`/users/${user.id}/playlists`);
    revalidatePath(`/users/${user.id}/playlists/${newData.id}`);
  }

  return { error: false, message: null };
};
