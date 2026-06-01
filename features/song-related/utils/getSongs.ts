import { supabaseClient } from "@/features/supabase/lib/supabaseClient";

export const getSongs = async (
  limit: number,
  offset: number,
): Promise<SongWithAuthor[]> => {
  const from = offset * limit;
  const to = from + limit;

  const { data, error } = await supabaseClient
    .from("songs")
    .select("*, users!public_songs_user_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .range(from, to)
    .limit(limit);

  if (error) {
    console.error(error);
    throw error;
  }

  return (
    data.map(({ users, ...rest }) => ({
      ...rest,
      author: users.full_name ?? "Guest",
    })) || []
  );
};
