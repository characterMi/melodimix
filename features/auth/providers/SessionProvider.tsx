"use client";

import { BrowserCookieAuthStorageAdapter } from "@supabase/auth-helpers-shared";
import { useEffect } from "react";

import { useSessionStore } from "@/features/auth/store/useSessionStore";
import {
  getPersistSessionCookie,
  setPersistSessionCookie,
} from "@/features/supabase/lib/getPersistSessionCookie";
import { getUserFromDB } from "@/features/user-related/actions";
import { onError } from "@/lib/onError";

export const SessionProvider = () => {
  const { updateSessionStore, session, supabase, setUser } = useSessionStore(
    (state) => ({
      updateSessionStore: state.updateStore,
      session: state.session,
      supabase: state.supabaseClient,
      setUser: state.setUser,
    }),
  );

  useEffect(() => {
    const {
      data: {
        subscription: { unsubscribe },
      },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (session) {
          if (!Boolean(getPersistSessionCookie())) setPersistSessionCookie();

          getUserFromDB().then(setUser);
        }

        updateSessionStore(session, false);
      }

      if (event === "SIGNED_OUT") {
        setPersistSessionCookie("", "Thu, 01 Jan 1970 00:00:00 GMT");
        updateSessionStore(null, false);
        setUser(null);
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

      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!data.session || sessionError) return;

      setUser(await getUserFromDB());

      const {
        data: { session: refreshedSession },
        error: refreshSessionError,
      } = await supabase.auth.refreshSession();

      if (refreshSessionError) {
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
