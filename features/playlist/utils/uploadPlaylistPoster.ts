import { supabaseClient } from "@/features/supabase/lib/supabaseClient";
import { onError } from "@/lib/onError";

/**
 *
 * @param name the name of the file to be uploaded
 * @param file the file to be uploaded
 * @returns "ERR" | POSTER_PATH | ""
 */
export const uploadPlaylistPoster = async (name: string, file: File | null) => {
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      onError("Uploaded file is not a valid image.");
      return "ERR";
    }

    const { data, error } = await supabaseClient.storage
      .from("playlist_posters")
      .upload(name, file, {
        upsert: true,
      });

    if (error) {
      onError("Uploading the playlist poster failed.");
      return "ERR";
    }

    return data.path;
  }

  return "";
};
