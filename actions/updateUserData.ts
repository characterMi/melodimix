"use server";

import { getUserData } from "./getUserData";

export const updateUserData = async (formData: FormData) => {
  const { supabase, user } = await getUserData();

  if (!user) return { error: "Unauthenticated User." };

  const name = formData.get("name") as string;
  const fullName = formData.get("fullname") as string;
  const avatar = formData.get("avatar") as File | undefined;

  if (typeof name !== "string" || typeof fullName !== "string") {
    return { error: "Invalid data." };
  }

  if (name.length > 50 || fullName.length > 100) {
    return { error: "Name or full name is too long!" };
  }

  let imagePath: string | null = null;

  if (avatar && avatar.size > 0) {
    if (!avatar.type.startsWith("image/")) {
      return { error: "Uploaded file is not a valid image." };
    }

    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(`avatar-${user.id}`, avatar, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return { error: "Something went wrong while uploading your avatar!" };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(data.path);

    imagePath = publicUrl;
  }

  const userData = {
    name: name || "Guest",
    full_name: fullName || "Guest",
    ...(imagePath ? { avatar_url: imagePath } : {}),
  };

  const dbUpdatePromise = supabase
    .from("users")
    .update(userData)
    .eq("id", user.id);

  const authUpdatePromise = supabase.auth.updateUser({
    data: userData,
  });

  const [{ error: dbUpdateError }, { error: authUpdateError }] =
    await Promise.all([dbUpdatePromise, authUpdatePromise]);

  if (dbUpdateError || authUpdateError) {
    console.error(dbUpdateError, authUpdateError);
    return { error: "Something went wrong while updating the user data!" };
  }

  return { error: null };
};
