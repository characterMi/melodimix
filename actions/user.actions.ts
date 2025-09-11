"use server";

import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { removeDuplicatedSpaces } from "@/lib/removeDuplicatedSpaces";

import type { User } from "@/types";
import type { UserMetadata } from "@supabase/supabase-js";

export const updateUserData = async (
  formData: FormData
): Promise<
  | {
      error: string;
      updatedUser?: undefined;
    }
  | {
      error: null;
      updatedUser: UserMetadata;
    }
> => {
  const { supabase, user } = await getCurrentUser();

  if (!user) return { error: "Unauthenticated User." };

  const name = (formData.get("name") as string | undefined)?.trim();
  const fullName = (formData.get("fullname") as string | undefined)?.trim();
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
    name: removeDuplicatedSpaces(name || "Guest"),
    full_name: removeDuplicatedSpaces(fullName || "Guest"),
    ...(imagePath ? { avatar_url: imagePath } : {}),
  };

  const dbUpdatePromise = supabase
    .from("users")
    .update(userData)
    .eq("id", user.id);

  const authUpdatePromise = supabase.auth.updateUser({
    data: userData,
  });

  const [
    { error: dbUpdateError },
    { data: updatedUser, error: authUpdateError },
  ] = await Promise.all([dbUpdatePromise, authUpdatePromise]);

  if (dbUpdateError || authUpdateError) {
    console.error(dbUpdateError, authUpdateError);
    return { error: "Something went wrong while updating the user data!" };
  }

  return { error: null, updatedUser: updatedUser.user.user_metadata };
};

export const getCurrentUser = async () => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, supabase };
};

export const getUserById = async (userId: string) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }

  return data as User;
};
