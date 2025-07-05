"use server";

import { revalidatePath } from "next/cache";
import { getUserData } from "./getUserData";

export const createPlaylist = async ({
  name,
  isPublic,
  songIds,
}: {
  name: string;
  isPublic: boolean;
  songIds: string[];
}): Promise<
  | { error: true; message: string; playlistId: null }
  | { playlistId: string; error: false; message: null }
> => {
  const { supabase, user } = await getUserData();

  if (!user) {
    return { error: true, message: "Unauthenticated User.", playlistId: null };
  }

  if (typeof name !== "string") {
    return {
      error: true,
      message: "Playlist name is required!",
      playlistId: null,
    };
  }

  if (name.length > 50 || name.length < 3) {
    return {
      error: true,
      message: "Playlist name is too long or too short!",
      playlistId: null,
    };
  }

  const { error, data } = await supabase
    .from("playlists")
    .insert({
      name,
      user_id: user.id,
      is_public: isPublic,
      song_ids: songIds,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error(error);

    return {
      error: true,
      message: "Something went wrong while creating the playlist!",
      playlistId: null,
    };
  }

  revalidatePath("/profile");
  return { playlistId: data.id, error: false, message: null };
};
