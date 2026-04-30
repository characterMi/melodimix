"use server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

import { removeDuplicatedSpaces } from "@/lib/removeDuplicatedSpaces";
import { getCurrentUser, getUserById } from "./user.actions";

import type { Playlist } from "@/types";

export const createPlaylist = async ({
  name,
  isPublic,
  songIds,
  playlistPoster,
}: {
  name: string;
  isPublic: boolean;
  songIds: number[];
  playlistPoster: File | null;
}): Promise<
  | { error: true; message: string; playlist: null }
  | { playlist: Playlist; error: false; message: null }
> => {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return { error: true, message: "Unauthenticated User.", playlist: null };
  }

  if (typeof name !== "string") {
    return {
      error: true,
      message: "Playlist name is required!",
      playlist: null,
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 50 || trimmedName.length < 3) {
    return {
      error: true,
      message: "Playlist name is too long or too short!",
      playlist: null,
    };
  }

  if (songIds.length > 100) {
    return {
      error: true,
      message:
        "Too many songs in this playlist, you can't add more than 100 songs to a playlist.",
      playlist: null,
    };
  }

  const userPlaylists = (await getUserPlaylists()) as Playlist[];

  if (userPlaylists.length >= 50) {
    return {
      error: true,
      message: "You can't create more than 50 playlists.",
      playlist: null,
    };
  }

  let posterPath = "";

  if (playlistPoster && playlistPoster.size > 0) {
    if (!playlistPoster.type.startsWith("image/")) {
      return {
        error: true,
        message: "Uploaded file is not a valid image.",
        playlist: null,
      };
    }

    const { data, error } = await supabase.storage
      .from("playlist_posters")
      .upload(`poster-${name}-${crypto.randomUUID()}`, playlistPoster, {
        upsert: true,
      });

    if (error) {
      return {
        error: true,
        message: "Uploading the playlist poster failed.",
        playlist: null,
      };
    }

    posterPath = data.path;
  }

  const newPlaylist = {
    name: removeDuplicatedSpaces(trimmedName),
    user_id: user.id,
    is_public: isPublic,
    song_ids: songIds,
    poster_path: posterPath,
  };

  const { error, data } = await supabase
    .from("playlists")
    .insert(newPlaylist)
    .select("id")
    .single();

  if (error || !data) {
    console.error(error);
    supabase.storage.from("playlist_posters").remove([posterPath]);

    return {
      error: true,
      message: "Something went wrong while creating the playlist!",
      playlist: null,
    };
  }

  revalidatePath("/profile");
  if (isPublic) {
    revalidatePath(`/users/${user.id}/playlists`);
    revalidatePath("/playlists");
    revalidatePath("/search");
  }

  return {
    playlist: {
      created_at: new Date().toISOString(),
      id: data.id,
      ...newPlaylist,
    },
    error: false,
    message: null,
  };
};

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
    revalidatePath("/playlists");
    revalidatePath("/search");
  }

  return true;
};

export const updatePlaylist = async (
  newData: Playlist,
  playlistPoster?: File | null
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

  let posterPath = newData.poster_path;

  if (playlistPoster && playlistPoster.size > 0) {
    if (!playlistPoster.type.startsWith("image/")) {
      return { error: true, message: "Uploaded file is not a valid image." };
    }

    const { data, error } = await supabase.storage
      .from("playlist_posters")
      .upload(
        newData.poster_path || `poster-${newData.name}-${crypto.randomUUID()}`,
        playlistPoster,
        { upsert: true }
      );

    if (error) {
      return { error: true, message: "Uploading the playlist poster failed." };
    }

    posterPath = data.path;
  }

  const { error } = await supabase
    .from("playlists")
    .update({
      ...newData,
      name: removeDuplicatedSpaces(trimmedName),
      poster_path: posterPath,
    })
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
    revalidatePath("/playlists");
    revalidatePath("/search");
  }

  return { error: false, message: null };
};

export const getUserPlaylists = async (
  userId?: string
): Promise<Playlist[] | { playlists: Playlist[]; author: string }> => {
  if (!userId) {
    return getCurrentUserPlaylists();
  }

  const supabase = createClientComponentClient();

  const user = await getUserById(userId);

  if (!user) return { playlists: [], author: "Guest" };

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return { playlists: [], author: "Guest" };
  }

  if (!data) {
    return { playlists: [], author: "Guest" };
  }

  return { playlists: data, author: user.name ?? "Guest" };
};

const getCurrentUserPlaylists = async () => {
  const { supabase, user } = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);

    return [];
  }

  if (!data) {
    return [];
  }

  return data;
};

export const getPublicPlaylists = async (limit = 20): Promise<Playlist[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};
