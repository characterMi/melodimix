"use client";

import { supabaseClient as supabase } from "@/lib/supabaseClient";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const SupabaseProvider = ({ children }: Props) => {
  const [supabaseClient] = useState(supabase);

  useEffect(() => {
    const handleOnline = () => supabaseClient.auth.startAutoRefresh();

    const handleOffline = () => supabaseClient.auth.stopAutoRefresh();

    if (!navigator.onLine) handleOffline();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [supabaseClient]);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};
