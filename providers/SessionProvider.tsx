"use client";

import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useSessionStore } from "@/store/useSessionStore";
import { useEffect } from "react";

export const SessionProvider = () => {
  const supabase = useSupabaseClient();
  const updateSessionStore = useSessionStore((state) => state.updateStore);

  useEffect(() => {
    const init = async () => {
      if (!navigator.onLine) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      updateSessionStore(session, false);
    };

    init();

    const {
      data: {
        subscription: { unsubscribe },
      },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        updateSessionStore(session, false);
      }

      if (event === "SIGNED_OUT") {
        updateSessionStore(null, false);
      }
    });

    const handleOnline = () => supabase.auth.refreshSession();

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      unsubscribe();
    };
  }, []);

  return null;
};
