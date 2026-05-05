import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://kwgzavjwstljoekbcpgc.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_iMX1ireQp2TAs2NyzfdMog_Mf5Q8LwD";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
