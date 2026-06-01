import { create } from "zustand";

import { supabaseClient } from "@/features/supabase/lib/supabaseClient";

import type { Session, SupabaseClient } from "@supabase/supabase-js";

interface SessionStore {
  supabaseClient: SupabaseClient<Database>;
  session: Session | null;
  isLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  updateStore: (session: Session | null, isLoading: boolean) => void;
}

export const useSessionStore = create<SessionStore>((setState) => ({
  supabaseClient,
  session: null,
  isLoading: true,
  user: null,
  setUser: (user) => setState({ user }),
  updateStore: (session, isLoading) => setState({ isLoading, session }),
}));
