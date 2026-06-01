import { useSessionStore } from "@/features/auth/store/useSessionStore";

export const useSupabaseClient = () =>
  useSessionStore((state) => state.supabaseClient);
