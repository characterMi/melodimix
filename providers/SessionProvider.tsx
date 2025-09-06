"use client";

import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useSessionStore } from "@/store/useSessionStore";
import { useEffect } from "react";

export const SessionProvider = () => {
  const supabase = useSupabaseClient();
  const updateSessionStore = useSessionStore((state) => state.updateStore);

  useEffect(() => {
    // Supabase keeps the session up to date by requesting for new refresh token every one hour, and if the request fail, it will try
    // again and again and again... so when we're offline, it will cause this infinite loop of requests. we're setting a cookie to whether
    // we should persist the session or not, the cookie expiration time will be updated only if we check the app online, but as soon as we
    // go offline, after one hour this persist-session cookie expires, so now supabase wont persist the session and we're not going to
    // have that retry loop. smart isn't it? (check the lib/supabaseClient.ts file to see the full code)
    const init = () => {
      if (!navigator.onLine) return;

      const expirationDate = new Date(
        Date.now() + 3600000 /* one hour */
      ).toUTCString();
      document.cookie = `persist-session=true; path=/; expires=${expirationDate}`;
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
