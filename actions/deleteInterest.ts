"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./getCurrentUser";

export const deleteInterest = async (songId: number) => {
  const { user, supabase } = await getCurrentUser();

  if (!user) return { error: "Unauthenticated user!" };

  const { error } = await supabase
    .from("interests")
    .delete()
    .eq("user_id", user.id)
    .eq("song_id", songId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/users/${user.id}/interests`);
  revalidatePath("/profile/interests");
  return { error: null };
};
