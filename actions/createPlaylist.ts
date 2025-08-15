"use server";

import { revalidatePath } from "next/cache";

import { removeDuplicatedSpaces } from "@/lib/removeDuplicatedSpaces";
import { getCurrentUser } from "./getCurrentUser";
import { getUserPlaylists } from "./getUserPlaylists";

import type { Playlist } from "@/types";

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
  const { supabase, user } = await getCurrentUser();

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

  const trimmedName = name.trim();

  if (trimmedName.length > 50 || trimmedName.length < 3) {
    return {
      error: true,
      message: "Playlist name is too long or too short!",
      playlistId: null,
    };
  }

  if (songIds.length > 100) {
    return {
      error: true,
      message:
        "Too many songs in this playlist, you can't add more than 100 songs to a playlist.",
      playlistId: null,
    };
  }

  const userPlaylists = (await getUserPlaylists()) as Playlist[];

  if (userPlaylists.length >= 20) {
    return {
      error: true,
      message: "You can't create more than 20 playlists.",
      playlistId: null,
    };
  }

  const { error, data } = await supabase
    .from("playlists")
    .insert({
      name: removeDuplicatedSpaces(trimmedName),
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
  isPublic && revalidatePath(`/users/${user.id}/playlists`);

  return { playlistId: data.id, error: false, message: null };
};
