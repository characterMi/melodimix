"use client";

import {
  getPersistSessionCookie,
  setPersistSessionCookie,
} from "@/lib/getPersistSessionCookie";
import { onError } from "@/lib/onError";
import { useSessionStore } from "@/store/useSessionStore";
import { BrowserCookieAuthStorageAdapter } from "@supabase/auth-helpers-shared";
import { useEffect } from "react";

export const SessionProvider = () => {
  const { updateSessionStore, session, supabase } = useSessionStore(
    (state) => ({
      updateSessionStore: state.updateStore,
      session: state.session,
      supabase: state.supabaseClient,
    })
  );

  useEffect(() => {
    const {
      data: {
        subscription: { unsubscribe },
      },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (session && !Boolean(getPersistSessionCookie())) {
          setPersistSessionCookie();
        }

        updateSessionStore(session, false);
      }

      if (event === "SIGNED_OUT") {
        setPersistSessionCookie("", "Thu, 01 Jan 1970 00:00:00 GMT");
        updateSessionStore(null, false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onOnline = async () => {
      // No need to refresh if we already have a session
      if (session || (supabase.auth as any).persistSession) return;

      // Setting the persist session = true and loading the current session from cookies to the StorageAdaptor, so that we can refresh the session manually...
      (supabase.auth as any).persistSession = true;
      (supabase.auth as any).storage = new BrowserCookieAuthStorageAdapter();

      const {
        data: { session: refreshedSession },
        error,
      } = await supabase.auth.refreshSession();

      if (error) {
        onError("Couldn't refresh the session.");
      }

      if (refreshedSession) {
        setPersistSessionCookie();
        updateSessionStore(refreshedSession, false);
      }
    };

    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("online", onOnline);
    };
  }, [session]);

  return null;
};
