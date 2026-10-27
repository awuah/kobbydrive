import { getServiceSupabase } from "@/lib/supabase";

export interface PrivateLinkConfig {
  enabled: boolean;
  token: string;
  usageCount: number;
  updated_at: string;
  updated_by?: string;
  note?: string;
}

const SETTINGS_KEY = "private_registration_link";
const DEFAULT_TOKEN = "kobby-vip-2026";

// In-memory cache to prevent database exhaustion on high traffic
let cachedConfig: PrivateLinkConfig | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export function invalidatePrivateLinkCache() {
  cachedConfig = null;
  cachedAt = 0;
}

/**
 * Retrieves the current private registration bypass configuration
 */
export async function getPrivateLinkConfig(): Promise<PrivateLinkConfig> {
  const now = Date.now();
  if (cachedConfig && now - cachedAt < CACHE_TTL_MS) {
    return cachedConfig;
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("kbdr_settings")
      .select("value, updated_at")
      .eq("key", SETTINGS_KEY)
      .maybeSingle();

    if (error) {
      console.warn("Could not fetch private_registration_link from settings:", error.message);
    }

    if (data && data.value) {
      try {
        const parsed = JSON.parse(data.value);
        cachedConfig = {
          enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : true,
          token: parsed.token || DEFAULT_TOKEN,
          usageCount: typeof parsed.usageCount === "number" ? parsed.usageCount : 0,
          updated_at: data.updated_at || new Date().toISOString(),
          updated_by: parsed.updated_by || "system",
          note: parsed.note || "",
        };
        cachedAt = now;
        return cachedConfig;
      } catch (parseErr) {
        console.error("Error parsing private link settings JSON:", parseErr);
      }
    }
  } catch (err) {
    console.error("Error connecting to Supabase for private link settings:", err);
  }

  // Fallback defaults
  const fallback: PrivateLinkConfig = {
    enabled: true,
    token: DEFAULT_TOKEN,
    usageCount: 0,
    updated_at: new Date().toISOString(),
    updated_by: "system",
    note: "Default private access link",
  };
  cachedConfig = fallback;
  cachedAt = now;
  return fallback;
}

/**
 * Saves updated private registration bypass configuration
 */
export async function savePrivateLinkConfig(
  updates: Partial<PrivateLinkConfig>,
  adminName?: string
): Promise<PrivateLinkConfig> {
  const current = await getPrivateLinkConfig();
  const nextConfig: PrivateLinkConfig = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
    updated_by: adminName || current.updated_by || "Admin",
  };

  try {
    const supabase = getServiceSupabase();
    await supabase.from("kbdr_settings").upsert(
      {
        key: SETTINGS_KEY,
        value: JSON.stringify(nextConfig),
        updated_at: nextConfig.updated_at,
      },
      { onConflict: "key" }
    );
  } catch (err) {
    console.error("Failed to save private link config to Supabase:", err);
  }

  cachedConfig = nextConfig;
  cachedAt = Date.now();
  return nextConfig;
}

/**
 * Increments registration counter when someone applies via the private link
 */
export async function incrementPrivateLinkUsage(): Promise<void> {
  try {
    const current = await getPrivateLinkConfig();
    const updated: PrivateLinkConfig = {
      ...current,
      usageCount: (current.usageCount || 0) + 1,
      updated_at: new Date().toISOString(),
    };

    const supabase = getServiceSupabase();
    await supabase.from("kbdr_settings").upsert(
      {
        key: SETTINGS_KEY,
        value: JSON.stringify(updated),
        updated_at: updated.updated_at,
      },
      { onConflict: "key" }
    );

    cachedConfig = updated;
    cachedAt = Date.now();
  } catch (err) {
    console.warn("Failed to increment private link usage count:", err);
  }
}

/**
 * Validates if the provided token matches the active enabled private bypass token
 */
export async function isBypassTokenValid(token: string | null | undefined): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const config = await getPrivateLinkConfig();
  if (!config.enabled) return false;

  const cleanInput = token.trim().toLowerCase();
  const cleanStored = config.token.trim().toLowerCase();

  return cleanInput.length > 0 && cleanInput === cleanStored;
}
