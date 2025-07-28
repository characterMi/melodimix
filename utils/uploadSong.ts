import { revalidatePath } from "@/actions/revalidatePath";
import type { Song } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
  const supabase = createClientComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const uploadSongPromise = supabase.storage
    .from("songs")
    .upload(`song-${title}-${uniqueId}`, songFile);
  const uploadImagePromise = supabase.storage
    .from("images")
    .upload(`image-${title}-${uniqueId}`, imageFile);

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
    artist,
    img_path: imageData.path,
    song_path: songData.path,
  };

  const { error: supabaseError, data } = await supabase
    .from("songs")
    .insert(newSong)
    .select("id")
    .single();

  if (supabaseError) {
    return { error: "Something went wrong while uploading the song!" };
  }

  revalidatePath("/", "layout");

  return {
    uploadedSong: {
      id: data.id,
      author: user.user_metadata.full_name ?? "Guest",
      ...newSong,
    },
  };
};
