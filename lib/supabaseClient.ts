import type { Database } from "@/types/db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

export const supabaseClient = createClientComponentClient<Database>({
  options: {
    global: {
      fetch: (input, init) => {
        if (
          input
            .toString()
            .endsWith("/auth/v1/token?grant_type=refresh_token") &&
          !navigator.onLine
        ) {
          return new Promise((res) => {
            toast.error("You're offline, cannot validate the token.");
            res(new Response("You're offline, cannot validate the token."));
          });
        }

        return fetch(input, init);
      },
    },
  },
});
