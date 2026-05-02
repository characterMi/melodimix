import { revalidatePath } from "@/actions/revalidatePath";
import { getAverageColor } from "@/lib/getAverageColor";
import { removeDuplicatedSpaces } from "@/lib/removeDuplicatedSpaces";
import { supabaseClient } from "@/lib/supabaseClient";
import { uploadFile } from "@/lib/uploadFile";

import type { UploadPhase } from "@/hooks/useUploadOrUpdateSong";
import type { Song, SongWithAuthor } from "@/types";

export const updateSong = async (
  newData: FormData,
  song: Song,
  onPhaseChange: (phase: UploadPhase) => void,
  onUploadProgress: (type: "song" | "image", progress: number) => void
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

  const updates: Promise<any>[] = [];

  let color = song.color;

  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      return { error: "Uploaded file is not a valid image." };
    }

    const { color: averageColor, error: colorError } = await getAverageColor(
      imageFile
    );

    if (colorError) {
      return {
        error:
          colorError.message ?? "Something's wrong with the uploaded image.",
      };
    }

    color = averageColor;

    const { data, error } = await supabaseClient.storage
      .from("images")
      .createSignedUploadUrl(song.img_path);

    if (error) {
      return { error: "Image upload failed." };
    }

    updates.push(
      uploadFile(
        { file: imageFile, type: "image", uploadUrl: data.signedUrl },
        onUploadProgress
      )
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
      .createSignedUploadUrl(song.song_path);

    if (error) {
      return { error: "Song upload failed." };
    }

    updates.push(
      uploadFile(
        { file: songFile, type: "song", uploadUrl: data.signedUrl },
        onUploadProgress
      )
    );
  }

  onPhaseChange("updating");

  const [imageUpdateResult, songUpdateResult] = await Promise.all(updates);

  if (imageUpdateResult?.error || songUpdateResult?.error) {
    console.error(imageUpdateResult?.error, songUpdateResult?.error);

    return { error: "Something went wrong while updating the song!" };
  }

  await supabaseClient
    .from("songs")
    .update({
      title: removeDuplicatedSpaces(title),
      artist: removeDuplicatedSpaces(artist),
      color,
    })
    .eq("user_id", user.id)
    .eq("id", song.id);

  revalidatePath("/", "layout");

  return {
    updatedSong: {
      ...song,
      title,
      author: user.user_metadata.full_name ?? "Guest",
      artist,
      color,
    },
  };
};
