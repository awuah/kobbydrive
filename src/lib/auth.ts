/**
 * Authorized Administrative & Superadmin Passcodes for Kobby Free Driving School
 * Legacy code "admin2026" is permanently disabled and rejected.
 */

// 4 Assigned Admin Passcodes for individual team members
export const PRIMARY_ADMIN_PASSCODES = [
  "KBD9482ADMN", // Admin 1
  "TAK7261DRVE", // Admin 2
  "FREE8394DRV", // Admin 3
  "MP6153KOBBY", // Admin 4
];

// Admin passcodes including optional hyphens for flexible typing
export const VALID_ADMIN_PASSCODES = [
  "KBD9482ADMN",
  "KBD-9482-ADMN",
  "TAK7261DRVE",
  "TAK-7261-DRVE",
  "FREE8394DRV",
  "FREE-8394-DRV",
  "MP6153KOBBY",
  "MP-6153-KOBBY",
];

// High-Privilege Superadmin Passcodes (Exclusive access to Audit & Activity Logs)
export const PRIMARY_SUPER_ADMIN_PASSCODE = "KOBBY9900SUPER";

export const SUPER_ADMIN_PASSCODES = [
  "KOBBY9900SUPER",
  "KOBBY-9900-SUPER",
  "SUPR8829KOBBY",
  "SUPR-8829-KOBBY",
];

export interface AdminIdentity {
  id: string;
  name: string;
  code: string;
  role: "superadmin" | "admin";
  color: string;
}

/**
 * Maps cleaned passcode to specific Admin user identity for tracking
 */
export function getAdminIdentity(passcode: string): AdminIdentity {
  if (!passcode) {
    return { id: "unknown", name: "Unknown Admin", code: "N/A", role: "admin", color: "slate" };
  }

  const clean = passcode.replace(/[\s-]/g, "").toUpperCase();

  // 1. Superadmin check
  if (
    clean === "KOBBY9900SUPER" ||
    clean === "SUPR8829KOBBY" ||
    clean === (process.env.SUPER_ADMIN_PASSCODE || "").replace(/[\s-]/g, "").toUpperCase()
  ) {
    return {
      id: "superadmin",
      name: "Super Admin (Owner)",
      code: clean,
      role: "superadmin",
      color: "emerald",
    };
  }

  // 2. The 4 Monitored Admin Codes
  if (clean === "KBD9482ADMN") {
    return {
      id: "admin_1",
      name: "Admin 1 (KBD9482ADMN)",
      code: "KBD9482ADMN",
      role: "admin",
      color: "blue",
    };
  }

  if (clean === "TAK7261DRVE") {
    return {
      id: "admin_2",
      name: "Admin 2 (TAK7261DRVE)",
      code: "TAK7261DRVE",
      role: "admin",
      color: "purple",
    };
  }

  if (clean === "FREE8394DRV") {
    return {
      id: "admin_3",
      name: "Admin 3 (FREE8394DRV)",
      code: "FREE8394DRV",
      role: "admin",
      color: "amber",
    };
  }

  if (clean === "MP6153KOBBY") {
    return {
      id: "admin_4",
      name: "Admin 4 (MP6153KOBBY)",
      code: "MP6153KOBBY",
      role: "admin",
      color: "indigo",
    };
  }

  // 3. Custom ENV key if set
  const envKey = process.env.ADMIN_SECRET_KEY;
  if (envKey && envKey.toLowerCase() !== "admin2026") {
    const keys = envKey.split(",").map((k) => k.replace(/[\s-]/g, "").toUpperCase());
    if (keys.includes(clean)) {
      return {
        id: "admin_custom",
        name: `Admin (${clean.slice(0, 4)}***)`,
        code: clean,
        role: "admin",
        color: "slate",
      };
    }
  }

  return { id: "admin_unidentified", name: "Admin (Standard)", code: clean, role: "admin", color: "slate" };
}

/**
 * Strictly checks if a passcode belongs to the Superadmin
 */
export function isSuperAdminPasscode(passcode: string): boolean {
  if (!passcode) return false;
  const clean = passcode.replace(/[\s-]/g, "").toUpperCase();
  if (clean === "ADMIN2026") return false;

  if (SUPER_ADMIN_PASSCODES.some((c) => c.replace(/[\s-]/g, "").toUpperCase() === clean)) {
    return true;
  }

  const envSuper = process.env.SUPER_ADMIN_PASSCODE;
  if (envSuper && envSuper.replace(/[\s-]/g, "").toUpperCase() === clean) {
    return true;
  }

  return false;
}

/**
 * Validates whether an entered passcode is an active admin or superadmin passcode
 */
export function isValidAdminPasscode(passcode: string): boolean {
  if (!passcode) return false;
  const cleaned = passcode.trim();

  // Explicitly reject disabled passcode
  if (cleaned.toLowerCase() === "admin2026") {
    return false;
  }

  // Check if superadmin
  if (isSuperAdminPasscode(cleaned)) {
    return true;
  }

  // Check against active passcodes
  const cleanAlphanumeric = cleaned.replace(/[\s-]/g, "").toUpperCase();
  const match = VALID_ADMIN_PASSCODES.some(
    (code) => code.replace(/[\s-]/g, "").toUpperCase() === cleanAlphanumeric
  );

  if (match) return true;

  // Also support custom ADMIN_SECRET_KEY from environment variables if configured
  const envKey = process.env.ADMIN_SECRET_KEY;
  if (envKey && envKey.toLowerCase() !== "admin2026") {
    const keys = envKey.split(",").map((k) => k.replace(/[\s-]/g, "").toUpperCase());
    if (keys.includes(cleanAlphanumeric)) {
      return true;
    }
  }

  return false;
}

/**
 * Helper to extract and verify admin identity from Request headers or cookies
 */
export function getAdminFromRequest(req: {
  headers: { get: (name: string) => string | null };
  cookies: { get: (name: string) => { value: string } | undefined };
}): { isAuthenticated: boolean; isSuperAdmin: boolean; identity: AdminIdentity } {
  let token = "";

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    token = authHeader.replace("Bearer ", "").trim();
  }

  if (!token) {
    const cookiePass = req.cookies.get("kbdr_admin_auth")?.value;
    if (cookiePass) {
      token = decodeURIComponent(cookiePass).trim();
    }
  }

  if (token && isValidAdminPasscode(token)) {
    const identity = getAdminIdentity(token);
    const isSuper = isSuperAdminPasscode(token);
    return {
      isAuthenticated: true,
      isSuperAdmin: isSuper,
      identity,
    };
  }

  return {
    isAuthenticated: false,
    isSuperAdmin: false,
    identity: { id: "guest", name: "Guest", code: "", role: "admin", color: "slate" },
  };
}