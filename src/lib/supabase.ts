import { createClient } from "@supabase/supabase-js";

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s || fallback;
}

const DEFAULT_URL = "https://bsztwifzletpauxuuirg.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzenR3aWZ6bGV0cGF1eHV1aXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3OTQyNTgsImV4cCI6MjA2ODM3MDI1OH0.8c0mftBtw_YQa3sUk-YVPgigIfUD7sOQQSQoztWw7LU";
const DEFAULT_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzenR3aWZ6bGV0cGF1eHV1aXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc5NDI1OCwiZXhwIjoyMDY4MzcwMjU4fQ.WTjER47lrnsRlJcuVcBb_XvrtYAuv4142OEBKn60A5s";

const supabaseUrl = cleanEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  DEFAULT_URL
);

const supabaseAnonKey = cleanEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  DEFAULT_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getServiceSupabase() {
  const serviceKey = cleanEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY,
    DEFAULT_SERVICE_ROLE_KEY
  );

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}