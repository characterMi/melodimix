import type { Database } from "@/types/types_supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabaseClient = createClientComponentClient<Database>();
