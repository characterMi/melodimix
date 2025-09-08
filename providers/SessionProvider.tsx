"use client";

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
        updateSessionStore(session, false);
      }

      if (event === "SIGNED_OUT") {
        updateSessionStore(null, false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Supabase keeps the session up to date by requesting for new refresh token every one hour, and if the request fail, it will try
    // again and again and again... so when we're offline, it will cause this infinite loop of requests. we're setting a cookie to whether
    // we should persist the session or not, the cookie expiration time will be updated only if we check the app online, but as soon as we
    // go offline, after one hour this persist-session cookie expires, so now supabase wont persist the session and we're not going to
    // have that retry loop. smart isn't it? (check the lib/supabaseClient.ts file to see the full code)
    const setPersistSessionCookie = () => {
      if (!navigator.onLine || !session) return;

      const expirationDate = new Date(
        Date.now() + 3600000 /* one hour */
      ).toUTCString();
      document.cookie = `persist-session=true; path=/; expires=${expirationDate}`;
    };

    setPersistSessionCookie();

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
