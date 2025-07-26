"use server";

import type { Playlist, Song } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getCurrentUser } from "./getCurrentUser";

type PlaylistSongsResponse = {
  data: Song[];
} & (
  | {
      playlist: Playlist & { author?: string };
      errMessage: undefined;
    }
  | {
      playlist: undefined;
      errMessage: string;
    }
);

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
