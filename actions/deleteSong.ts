"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./getCurrentUser";

export const deleteSong = async (songId: string): Promise<boolean> => {
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
