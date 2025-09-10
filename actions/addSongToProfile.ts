"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./getCurrentUser";

export const addSongToProfile = async (
  songId: number
): Promise<
  | {
      error: string;
    }
  | {
      error: null;
    }
> => {
  const { user, supabase } = await getCurrentUser();

  if (!user) return { error: "Unauthenticated user." };

  const { error } = await supabase
    .from("interests")
    .insert({ song_id: songId, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/users/${user.id}/interests`);
  revalidatePath("/profile/interests");
  return { error: null };
};
