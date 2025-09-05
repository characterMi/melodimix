import { useSessionStore } from "@/store/useSessionStore";

export const useSession = () =>
  useSessionStore((state) => ({
    session: state.session,
    isLoading: state.isLoading,
    supabaseClient: state.supabaseClient,
  }));
