"use server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

import { normalizeArtistName } from "@/lib/normalizeArtistName";
import { getCurrentUser } from "./user.actions";

import type { Playlist, Song, SongWithAuthor } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type PlaylistSongsResponse = {
  data: SongWithAuthor[];
} & (
  | {
      playlist: Playlist & { author: string };
      errMessage: undefined;
    }
  | {
      playlist: undefined;
      errMessage: string;
    }
);

type UserSongsParams = {
  userId: string;
  limit: number;
  offset: number;
} | null;

export const deleteSong = async (songId: number): Promise<boolean> => {
  const { supabase, user } = await getCurrentUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("songs")
    .select("img_path, song_path")
    .eq("id", songId)
    .eq("user_id", user.id)
    .single();

  if (!data || error) return false;

  const dbDeletionPromise = supabase
    .from("songs")
    .delete()
    .eq("id", songId)
    .eq("user_id", user.id);
  const imageDeletionPromise = supabase.storage
    .from("images")
    .remove([data.img_path]);
  const songDeletionPromise = supabase.storage
    .from("songs")
    .remove([data.song_path]);

  const [dbDeletionResult, imageDeletionResult, songDeletionResult] =
    await Promise.all([
      dbDeletionPromise,
      imageDeletionPromise,
      songDeletionPromise,
    ]);

  if (
    dbDeletionResult.error ||
    imageDeletionResult.error ||
    songDeletionResult.error
  )
    return false;

  revalidatePath("/profile", "layout");
  revalidatePath(`/users/${user.id}`, "layout");
  revalidatePath("/", "layout");

  return true;
};

export const getArtistSongs = async (
  artistName: string | undefined
): Promise<Song[] | null> => {
  if (!artistName || typeof artistName !== "string") return null;

  const supabase = createClientComponentClient();

  const normalized = normalizeArtistName(artistName);

  const { data, error } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .ilike("artist", normalized)
    .limit(10)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return null;
  }

  return data.map((song) => ({
    ...song,
    author: song.users.full_name ?? "Guest",
  }));
};

export const getLikedSongsWithoutLimit = async () => {
  const { user, supabase } = await getCurrentUser();

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.songs,
  }));
};

export const getLikedSongs = async (
  limit: number = 25,
  offset: number = 0
): Promise<SongWithAuthor[]> => {
  const { user, supabase } = await getCurrentUser();

  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .range(from, to)
    .limit(limit);

  if (error) {
    console.error(error);

    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.songs,
  }));
};

export const getSong = async (
  songId: string
): Promise<SongWithAuthor | null> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .eq("id", songId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return { ...data, author: data.users.full_name ?? "Guest" };
};

export const getSongs = async (
  limit: number = 20
): Promise<SongWithAuthor[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return (
    data.map((song) => ({
      ...song,
      author: song.users.full_name ?? "Guest",
    })) || []
  );
};

export const getUserSongs = async (
  params: UserSongsParams
): Promise<SongWithAuthor[]> => {
  const { supabase, user } = await getCurrentUser();

  // if no userId is provided, return the current user's songs
  if (!params?.userId) {
    return getCurrentUserSongs(supabase, /* current user */ user?.id);
  }

  const { limit, offset, userId } = params;

  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to)
    .limit(limit);

  if (error) {
    console.error(error);

    throw error;
  }

  if (!data) {
    return [];
  }

  return data;
};

const getCurrentUserSongs = async (
  supabase: SupabaseClient,
  currentUserId: string | undefined
) => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", currentUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return [];
  }

  if (!data) {
    return [];
  }

  return data;
};

export const getPlaylistSongs = async (
  playlistId: string,
  userId?: string
): Promise<PlaylistSongsResponse> => {
  if (!userId) {
    return getCurrentUserPlaylistSongs(playlistId);
  }

  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("playlists")
    .select("*, users(full_name)")
    .eq("user_id", userId)
    .eq("id", playlistId)
    .eq("is_public", true)
    .single();

  if (error) {
    console.error(error);

    return {
      data: [],
      errMessage: "Something went wrong.",
      playlist: undefined,
    };
  }

  if (!data) {
    return {
      data: [],
      errMessage: "Such playlist doesn't exist.",
      playlist: undefined,
    };
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .in("id", data.song_ids);

  if (songsError) {
    console.error(songsError);

    return {
      data: [],
      errMessage: "Something went wrong.",
      playlist: undefined,
    };
  }

  if (!songs) {
    return { data: [], errMessage: "No songs found.", playlist: undefined };
  }

  return {
    data: songs.map((song) => ({
      ...song,
      author: song.users.full_name ?? "Guest",
    })),
    playlist: { ...data, author: data.users.full_name ?? "Guest" },
    errMessage: undefined,
  };
};

const getCurrentUserPlaylistSongs = async (
  playlistId: string
): Promise<PlaylistSongsResponse> => {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return {
      data: [],
      errMessage: "User not found.",
      playlist: undefined,
    };
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", playlistId)
    .single();

  if (error) {
    console.error(error);

    return {
      data: [],
      errMessage: "Something went wrong.",
      playlist: undefined,
    };
  }

  if (!data) {
    return {
      data: [],
      errMessage: "Such playlist doesn't exist.",
      playlist: undefined,
    };
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .in("id", data.song_ids);

  if (songsError) {
    console.error(songsError);

    return {
      data: [],
      errMessage: "Something went wrong.",
      playlist: undefined,
    };
  }

  if (!songs) {
    return { data: [], errMessage: "No songs found.", playlist: undefined };
  }

  return {
    data: songs.map((song) => ({
      ...song,
      author: song.users.full_name ?? "Guest",
    })),
    playlist: data,
    errMessage: undefined,
  };
};
