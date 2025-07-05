"use server";

import type { User } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
