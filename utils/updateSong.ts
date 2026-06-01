import { revalidatePath } from "@/actions/revalidatePath";
import { removeDuplicatedSpaces } from "@/lib/removeDuplicatedSpaces";
import { supabaseClient } from "@/lib/supabaseClient";
import { uploadFile } from "@/lib/uploadFile";

import type { UploadPhase } from "@/hooks/useUploadOrUpdateSong";
import type { Song, SongWithAuthor } from "@/types";

const ABORT_ERROR = "AbortSignal";

export const updateSong = async (
  newData: FormData,
  song: Song,
  onPhaseChange: (phase: UploadPhase) => void,
  onUploadProgress: (type: "song" | "image", progress: number) => void,
  controller: AbortController,
): Promise<
  | {
      error: string;
      updatedSong?: undefined;
    }
  | {
      updatedSong: SongWithAuthor;
      error?: undefined;
    }
> => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

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

  // Check if the operation is cancelled before updating
  if (controller.signal.aborted) {
    return { error: ABORT_ERROR };
  }

  const dbUpdatePromise = supabaseClient
    .from("songs")
    .update({
      title: removeDuplicatedSpaces(title),
      artist: removeDuplicatedSpaces(artist),
    })
    .eq("user_id", user.id)
    .eq("id", song.id)
    .abortSignal(controller.signal);

  // @ts-ignore
  const updates: Promise<any>[] = [dbUpdatePromise];

  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      return { error: "Uploaded file is not a valid image." };
    }

    const { data, error } = await supabaseClient.storage
      .from("images")
      .createSignedUploadUrl(song.img_path, { upsert: true });

    if (error) {
      return { error: "Image upload failed." };
    }

    updates.push(
      uploadFile(
        { file: imageFile, type: "image", uploadUrl: data.signedUrl },
        onUploadProgress,
        controller.signal,
      ),
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

    const { data, error } = await supabaseClient.storage
      .from("songs")
      .createSignedUploadUrl(song.song_path, { upsert: true });

    if (error) {
      return { error: "Song upload failed." };
    }

    updates.push(
      uploadFile(
        { file: songFile, type: "song", uploadUrl: data.signedUrl },
        onUploadProgress,
        controller.signal,
      ),
    );
  }

  onPhaseChange("updating");

  try {
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
        songUpdateResult?.error,
      );

      if (controller.signal.aborted) {
        return { error: ABORT_ERROR };
      }

      return { error: "Something went wrong while updating the song!" };
    }
  } catch {
    if (controller.signal.aborted) return { error: ABORT_ERROR };

    return { error: "Something went wrong." };
  }

  revalidatePath("/", "layout");

  return {
    updatedSong: {
      ...song,
      title,
      author: user.user_metadata.full_name ?? "Guest",
      artist,
    },
  };
};
