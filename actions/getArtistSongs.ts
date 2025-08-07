"use server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import type { Song } from "@/types";

export const getArtistSongs = async (
  artistName: string | undefined
): Promise<Song[] | null> => {
  if (!artistName) return null;

  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .ilike("artist", `%${artistName}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return null;
  }

  return (
    data.map((song) => ({
      ...song,
      author: song.users.full_name ?? "Guest",
    })) || []
  );
};
