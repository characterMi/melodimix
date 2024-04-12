"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export const uploadSongToStorage = async (
  formData: FormData,
  userId: string
) => {
  const supabaseClient = createServerActionClient({
    cookies,
  });

  const imageFile = formData.get("img");
  const songFile = formData.get("song");
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;

  if (!imageFile || !songFile || !title.trim() || !author.trim()) {
    return { error: "Missing fields" };
  }

  const uniqueId = crypto.randomUUID();

  // Upload song
  const { data: songData, error: songError } = await supabaseClient.storage
    .from("songs")
    .upload(`song-${title.trim()}-${uniqueId}`, songFile);

  if (songError) {
    console.error("Song Error => ", songError);

    return { error: "Song Error => " + songError.message };
  }

  // Upload image
  const { data: imageData, error: imageError } = await supabaseClient.storage
    .from("images")
    .upload(`image-${title.trim()}-${uniqueId}`, imageFile);

  if (imageError) {
    console.error("Image Error => ", imageError);

    return { error: "Image Error => " + imageError.message };
  }

  const { error: supabaseError } = await supabaseClient.from("songs").insert({
    user_id: userId,
    title: title.trim(),
    author: author.trim(),
    img_path: imageData.path,
    song_path: songData.path,
  });

  if (supabaseError) {
    console.error("Supabase Error => ", supabaseError);

    return { error: "Supabase Error => " + supabaseError.message };
  }

  revalidatePath("/");
};
