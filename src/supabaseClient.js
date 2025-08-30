import { createClient } from "@supabase/supabase-js";

// ✅ These should be stored in .env (not hardcoded)
const supabaseUrl = "https://stpmchwlwtzzadvqtttn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cG1jaHdsd3R6emFkdnF0dHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODMwNDMsImV4cCI6MjA2ODY1OTA0M30.g9G-x2tcAwLXli2DrjmvIwhsxIILr73yOiIT3ferisc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
