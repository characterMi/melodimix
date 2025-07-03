"use server";

import type { Song } from "@/types";
import { revalidatePath } from "next/cache";
import { getUserData } from "./getUserData";

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
  const { supabase, user } = await getUserData();

  if (!user) {
    return { error: "Unauthenticated User." };
  }

  const imageFile = newData.get("img") as File | null;
  const songFile = newData.get("song") as File | null;
  const title = (newData.get("title") as string).trim();
  const author = (newData.get("author") as string).trim();

  if (
    !title ||
    !author ||
    typeof title !== "string" ||
    typeof author !== "string"
  ) {
    return { error: "Missing fields !" };
  }

  if (title.length > 100 || author.length > 50) {
    return { error: "Title or Author is too long!" };
  }

  const dbUpdatePromise = supabase
    .from("songs")
    .update({
      title,
      author,
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
      id: songData.id,
      title,
      author,
      img_path: imageUpdateResult?.data.path ?? songData.img_path,
      song_path: songUpdateResult?.data.path ?? songData.song_path,
      user_id: user.id,
    },
  };
};
