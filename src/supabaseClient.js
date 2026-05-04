import { createClient } from "@supabase/supabase-js";

// ✅ These should be stored in .env (not hardcoded)
const supabaseUrl = "https://kwgzavjwstljoekbcpgc.supabase.co";
const supabaseAnonKey = "sb_publishable_iMX1ireQp2TAs2NyzfdMog_Mf5Q8LwD";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
