import { revalidatePath } from "@/actions/revalidatePath";
import { supabaseClient } from "@/features/supabase/lib/supabaseClient";
import { uploadFile } from "@/features/upload-song/lib/uploadFile";
import { removeDuplicatedSpaces } from "@/lib/removeDuplicatedSpaces";

import type { UploadPhase } from "../hooks/useUploadOrUpdateSong";

const ABORT_ERROR = "AbortSignal";

export const uploadSong = async (
  formData: FormData,
  onPhaseChange: (phase: UploadPhase) => void,
  onUploadProgress: (type: "song" | "image", progress: number) => void,
  controller: AbortController,
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

  // Before uploading, check if the user has aborted the request
  if (controller.signal.aborted) {
    return { error: ABORT_ERROR };
  }

  onPhaseChange("uploading");

  const uniqueId = crypto.randomUUID();
  const path = `${title} - ${artist}-${uniqueId}`;

  const songDataPromise = supabaseClient.storage
    .from("songs")
    .createSignedUploadUrl(`song-${path}`);
  const imageDataPromise = supabaseClient.storage
    .from("images")
    .createSignedUploadUrl(`image-${path}`);

  const [
    { data: songData, error: songDataError },
    { data: imageData, error: imageDataError },
  ] = await Promise.all([songDataPromise, imageDataPromise]);

  if (songDataError || imageDataError) {
    return {
      error:
        songDataError?.message || imageDataError?.message || "Upload failed.",
    };
  }

  try {
    const uploadSongPromise = uploadFile(
      { file: songFile, type: "song", uploadUrl: songData.signedUrl },
      onUploadProgress,
      controller.signal,
    );
    const uploadImagePromise = uploadFile(
      { file: imageFile, type: "image", uploadUrl: imageData.signedUrl },
      onUploadProgress,
      controller.signal,
    );

    const [{ error: songUploadError }, { error: imageUploadError }] =
      await Promise.all([uploadSongPromise, uploadImagePromise]);

    if (songUploadError || imageUploadError || controller.signal.aborted) {
      // Cleanup any uploaded files (no need for await)
      supabaseClient.storage.from("songs").remove([songData.path]);
      supabaseClient.storage.from("images").remove([imageData.path]);

      if (controller.signal.aborted) {
        return { error: ABORT_ERROR };
      }

      return {
        error:
          songUploadError?.message ||
          imageUploadError?.message ||
          "Upload failed.",
      };
    }

    onPhaseChange("creating");

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
      .abortSignal(controller.signal)
      .single();

    if (supabaseError || controller.signal.aborted) {
      supabaseClient.storage.from("songs").remove([songData.path]);
      supabaseClient.storage.from("images").remove([imageData.path]);

      if (controller.signal.aborted) {
        return { error: ABORT_ERROR };
      }

      return { error: "Something went wrong while creating the song!" };
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
  } catch {
    supabaseClient.storage.from("songs").remove([songData.path]);
    supabaseClient.storage.from("images").remove([imageData.path]);

    if (controller.signal.aborted) {
      return { error: ABORT_ERROR };
    }

    return {
      error: "Upload failed.",
    };
  }
};
