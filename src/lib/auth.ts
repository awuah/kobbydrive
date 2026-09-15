/**
 * Authorized Administrative Passcodes for Kobby Free Driving School
 * Legacy code "admin2026" is permanently disabled and rejected.
 */
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

export const PRIMARY_ADMIN_PASSCODES = [
  "KBD9482ADMN",
  "TAK7261DRVE",
  "FREE8394DRV",
  "MP6153KOBBY",
];

/**
 * Validates whether an entered passcode is an active admin passcode
 */
export function isValidAdminPasscode(passcode: string): boolean {
  if (!passcode) return false;
  const cleaned = passcode.trim();

  // Explicitly reject disabled passcode
  if (cleaned.toLowerCase() === "admin2026") {
    return false;
  }

  // Check against active passcodes
  const match = VALID_ADMIN_PASSCODES.some(
    (code) => code.toUpperCase() === cleaned.toUpperCase()
  );

  if (match) return true;

  // Also support custom ADMIN_SECRET_KEY from environment variables if configured
  const envKey = process.env.ADMIN_SECRET_KEY;
  if (envKey && envKey.toLowerCase() !== "admin2026") {
    const keys = envKey.split(",").map((k) => k.trim().toUpperCase());
    if (keys.includes(cleaned.toUpperCase())) {
      return true;
    }
  }

  return false;
}