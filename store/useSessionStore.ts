import { create } from "zustand";

import { supabaseClient } from "@/lib/supabaseClient";

import type { Database } from "@/types/db";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

interface SessionStore {
  supabaseClient: SupabaseClient<Database>;
  session: Session | null;
  isLoading: boolean;
  updateStore: (session: Session | null, isLoading: boolean) => void;
}

export const useSessionStore = create<SessionStore>((setState) => ({
  supabaseClient,
  session: null,
  isLoading: true,
  updateStore: (session, isLoading) => setState({ isLoading, session }),
}));
