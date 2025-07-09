"use server";

import type { Playlist } from "@/types";
import { revalidatePath } from "next/cache";
import { getUserData } from "./getUserData";

export const updatePlaylist = async (
  newData: Playlist
): Promise<
  { error: true; message: string } | { error: false; message: null }
> => {
  const { supabase, user } = await getUserData();

  if (!user) {
    return { error: true, message: "Unauthenticated User." };
  }

  if (typeof newData.name !== "string") {
    return { error: true, message: "Playlist name is required!" };
  }

  if (newData.name.length > 50 || newData.name.length < 3) {
    return { error: true, message: "Playlist name is too long or too short!" };
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("id");

  if (songsError) {
    return {
      error: true,
      message: "Something went wrong!",
    };
  }

  if (newData.song_ids.length > songs.length) {
    return {
      error: true,
      message: "Too many songs in this playlist, we don't have this much song.",
    };
  }

  const { error } = await supabase
    .from("playlists")
    .update(newData)
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
