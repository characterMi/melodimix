"use server";

import type { Song } from "@/types";
import { getUserData } from "./getUserData";
import { sanitize } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";

export const uploadSong = async (
  formData: FormData
): Promise<
  | {
      error: string;
      uploadedSong?: undefined;
    }
  | {
      uploadedSong: Song;
      error?: undefined;
    }
> => {
  const { supabase, user } = await getUserData();

  if (!user) {
    return { error: "Unauthenticated User." };
  }

  const imageFile = formData.get("img") as File | undefined;
  const songFile = formData.get("song") as File | undefined;
  const title = (formData.get("title") as string | undefined)?.trim();
  const author = (formData.get("author") as string | undefined)?.trim();

  if (!imageFile || !songFile || !title || !author) {
    return { error: "Missing fields !" };
  }

  if (title.length > 100 || author.length > 50) {
    return { error: "Title or Author is too long!" };
  }

  if (!imageFile.type.startsWith("image/")) {
    return { error: "Uploaded file is not a valid image." };
  }

  if (
    songFile.type !== "audio/mpeg" &&
    songFile.type !== "audio/mp3" &&
    !songFile.name.toLowerCase().endsWith(".mp3")
  ) {
    return { error: "Only .mp3 audio files are allowed." };
  }

  const cleanTitle = sanitize(title);
  const uniqueId = crypto.randomUUID();

  const uploadSongPromise = supabase.storage
    .from("songs")
    .upload(`song-${cleanTitle}-${uniqueId}`, songFile);
  const uploadImagePromise = supabase.storage
    .from("images")
    .upload(`image-${cleanTitle}-${uniqueId}`, imageFile);

  const [
    { data: songData, error: songError },
    { data: imageData, error: imageError },
  ] = await Promise.all([uploadSongPromise, uploadImagePromise]);

  if (songError || imageError) {
    return { error: "Failed to upload the song!" };
  }

  const newSong = {
    user_id: user.id,
    title,
    author,
    img_path: imageData.path,
    song_path: songData.path,
  };

  const { error: supabaseError } = await supabase.from("songs").insert(newSong);

  if (supabaseError) {
    return { error: "Something went wrong while uploading the song!" };
  }

  revalidatePath("/", "layout");

  return {
    uploadedSong: {
      id: uniqueId,
      ...newSong,
    },
  };
};
