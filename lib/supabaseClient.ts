import type { Database } from "@/types/db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabaseClient = createClientComponentClient<Database>();
