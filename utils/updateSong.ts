import type { Song } from "@/types";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../actions/getCurrentUser";

export const updateSong = async (
  newData: FormData,
  songData: {
    id: string;
    img_path: string;
    song_path: string;
  }
): Promise<
  | {
      error: string;
      updatedSong?: undefined;
    }
  | {
      updatedSong: Song;
      error?: undefined;
    }
> => {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return { error: "Unauthenticated User." };
  }

  const imageFile = newData.get("img") as File | null;
  const songFile = newData.get("song") as File | null;
  const title = (newData.get("title") as string).trim();
  const artist = (newData.get("artist") as string).trim();

  if (
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

  const dbUpdatePromise = supabase
    .from("songs")
    .update({
      title,
      artist,
    })
    .eq("user_id", user.id)
    .eq("id", songData.id);

  // @ts-ignore
  const updates: Promise<any>[] = [dbUpdatePromise];

  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      return { error: "Uploaded file is not a valid image." };
    }

    updates.push(
      supabase.storage
        .from("images")
        .update(songData.img_path, imageFile, { upsert: true })
    );
  }

  if (songFile && songFile.size > 0) {
    if (
      songFile.type !== "audio/mpeg" &&
      songFile.type !== "audio/mp3" &&
      !songFile.name.toLowerCase().endsWith(".mp3")
    ) {
      return { error: "Only .mp3 audio files are allowed." };
    }

    updates.push(
      supabase.storage
        .from("songs")
        .update(songData.song_path, songFile, { upsert: true })
    );
  }

  const [dbUpdateResult, imageUpdateResult, songUpdateResult] =
    await Promise.all(updates);

  if (
    dbUpdateResult.error ||
    imageUpdateResult?.error ||
    songUpdateResult?.error
  ) {
    console.error(
      dbUpdateResult.error,
      imageUpdateResult?.error,
      songUpdateResult?.error
    );

    return { error: "Something went wrong while updating the song!" };
  }

  revalidatePath("/", "layout");

  return {
    updatedSong: {
      ...songData,
      title,
      author: user.user_metadata.name ?? "Guest",
      artist,
      user_id: user.id,
    },
  };
};
