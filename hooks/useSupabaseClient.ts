import { useSessionStore } from "@/store/useSessionStore";

export const useSupabaseClient = () =>
  useSessionStore((state) => state.supabaseClient);
