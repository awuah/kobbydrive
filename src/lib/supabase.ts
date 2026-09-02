import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://bsztwifzletpauxuuirg.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzenR3aWZ6bGV0cGF1eHV1aXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3OTQyNTgsImV4cCI6MjA2ODM3MDI1OH0.8c0mftBtw_YQa3sUk-YVPgigIfUD7sOQQSQoztWw7LU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getServiceSupabase() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzenR3aWZ6bGV0cGF1eHV1aXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc5NDI1OCwiZXhwIjoyMDY4MzcwMjU4fQ.WTjER47lrnsRlJcuVcBb_XvrtYAuv4142OEBKn60A5s";

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}