import type { Database } from "@/types/db";
import { createClient } from "@supabase/supabase-js";

const isOnline = typeof navigator === "undefined" ? true : navigator.onLine;

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: isOnline,
      detectSessionInUrl: isOnline,
    },
  }
);
