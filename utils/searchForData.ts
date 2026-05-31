import { supabaseClient } from "@/lib/supabaseClient";
import { Filters } from "@/store/useSearch";
import type { Playlist, SongWithAuthor } from "@/types";

export const searchForData = async (
  searchValue: string,
  signal: AbortSignal,
  filters: Filters,
  shouldApplyFilters: boolean,
): Promise<SongWithAuthor[] | Playlist[]> => {
  if (typeof searchValue !== "string") return [];

  // Unfiltered Songs
  if (!shouldApplyFilters) {
    if (!searchValue || searchValue.length > 50) return [];

    const { data, error } = await supabaseClient
      .from("songs")
      .select("*, users!public_songs_user_id_fkey(full_name)")
      .or(`title.ilike.%${searchValue}%,artist.ilike.%${searchValue}%`)
      .order("created_at", { ascending: false })
      .limit(10)
      .abortSignal(signal);

    if (error) throw error;

    return data.map(({ users, ...rest }) => ({
      ...rest,
      author: users.full_name ?? "Guest",
    }));
  }

  // Filtered Songs
  if (filters.searchFor === "songs") {
    const { data, error } = await supabaseClient
      .from("songs")
      .select("*, users!public_songs_user_id_fkey(full_name)")
      .or(`title.ilike.%${searchValue}%,artist.ilike.%${searchValue}%`)
      .order(filters.sortBy === "date" ? "created_at" : filters.sortBy, {
        ascending: filters.asc,
      })
      .limit(10)
      .abortSignal(signal);

    if (error) throw error;

    return data.map(({ users, ...rest }) => ({
      ...rest,
      author: users.full_name ?? "Guest",
    }));
  }

  // Playlists
  const { data, error } = await supabaseClient
    .from("playlists")
    .select("*")
    .eq("is_public", true)
    .ilike("name", `%${searchValue}%`)
    .order(filters.sortBy === "date" ? "created_at" : "name", {
      ascending: filters.asc,
    })
    .limit(10)
    .abortSignal(signal);

  if (error) throw error;

  return data;
};
