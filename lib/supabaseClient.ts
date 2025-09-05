import type { Database } from "@/types/db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
          return Promise.reject("You're offline, cannot validate the token.");
        }

        return fetch(input, init);
      },
    },
  },
});
