"use client";

import { supabaseClient as supabase } from "@/lib/supabaseClient";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const SupabaseProvider = ({ children }: Props) => {
  const [supabaseClient] = useState(supabase);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};
