import { revalidatePath } from "@/actions/revalidatePath";
import { removeDuplicatedSpaces } from "@/lib/removeDuplicatedSpaces";
import { supabaseClient } from "@/lib/supabaseClient";

import type { SongWithAuthor } from "@/types";

export const uploadSong = async (
  formData: FormData
): Promise<
  | {
      error: string;
      uploadedSong?: undefined;
    }
  | {
      uploadedSong: SongWithAuthor;
      error?: undefined;
    }
> => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return { error: "Unauthenticated User." };
  }

  const imageFile = formData.get("img") as File | undefined;
  const songFile = formData.get("song") as File | undefined;
  const title = (formData.get("title") as string | undefined)?.trim();
  const artist = (formData.get("artist") as string | undefined)?.trim();

  if (
    !imageFile ||
    !songFile ||
    !title ||
    !artist ||
    typeof title !== "string" ||
    typeof artist !== "string"
  ) {
    return { error: "Missing fields !" };
  }

  if (
    title.length > 100 ||
    title.length < 3 ||
    artist.length > 50 ||
    artist.length < 3
  ) {
    return { error: "Either Title or Artist is too long or too short!" };
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

  const uniqueId = crypto.randomUUID();

  const uploadSongPromise = supabaseClient.storage
    .from("songs")
    .upload(`song-${title}-${uniqueId}`, songFile);
  const uploadImagePromise = supabaseClient.storage
    .from("images")
    .upload(`image-${title}-${uniqueId}`, imageFile);

  const [
    { data: songData, error: songError },
    { data: imageData, error: imageError },
  ] = await Promise.all([uploadSongPromise, uploadImagePromise]);

  if (songError || imageError) {
    // Cleanup any uploaded files (no need to await)
    if (songData) supabaseClient.storage.from("songs").remove([songData.path]);
    if (imageData)
      supabaseClient.storage.from("images").remove([imageData.path]);

    return {
      error: songError?.message || imageError?.message || "Upload failed.",
    };
  }

  const newSong = {
    user_id: user.id,
    title: removeDuplicatedSpaces(title),
    artist: removeDuplicatedSpaces(artist),
    img_path: imageData.path,
    song_path: songData.path,
  };

  const { error: supabaseError, data } = await supabaseClient
    .from("songs")
    .insert(newSong)
    .select("id")
    .single();

  if (supabaseError) {
    supabaseClient.storage.from("songs").remove([songData.path]);
    supabaseClient.storage.from("images").remove([imageData.path]);

    return { error: "Something went wrong while uploading the song!" };
  }

  revalidatePath("/", "layout");

  return {
    uploadedSong: {
      id: data.id,
      created_at: new Date().toISOString(),
      author: user.user_metadata.full_name ?? "Guest",
      ...newSong,
    },
  };
};
