import type { Database } from "@/types/db";
import { BrowserCookieAuthStorageAdapter } from "@supabase/auth-helpers-shared";
import { createClient } from "@supabase/supabase-js";
import { getCookie } from "./getCookie";

const isOnline = typeof navigator === "undefined" ? true : navigator.onLine;
const persistSession = Boolean(getCookie("persist-session"));

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: isOnline,
      detectSessionInUrl: isOnline,
      persistSession: isOnline || persistSession,
      storage: new BrowserCookieAuthStorageAdapter(),
    },
  }
);
