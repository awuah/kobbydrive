import { createClient } from "@supabase/supabase-js";

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

const supabaseUrl = cleanEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
);

const supabaseAnonKey = cleanEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

// Client-side / public Supabase instance
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// Server-side privileged Supabase client with Service Role Key
export function getServiceSupabase() {
  const serviceKey = cleanEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY
  );

  const url = cleanEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  );

  if (!url || !serviceKey) {
    console.error(
      "Missing Supabase configuration: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set."
    );
  }

  return createClient(
    url || "https://placeholder.supabase.co",
    serviceKey || supabaseAnonKey || "placeholder-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}