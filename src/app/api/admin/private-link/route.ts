import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getPrivateLinkConfig, savePrivateLinkConfig } from "@/lib/private-link";
import { recordAdminActivity } from "@/lib/activity-logger";

export async function GET(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Passcode required." },
        { status: 401 }
      );
    }

    const config = await getPrivateLinkConfig();

    // Determine host for easy 1-click sharing
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "kobbydrive.com";
    const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const fullUrl = `${proto}://${host}/?access=${config.token}`;

    return NextResponse.json({
      success: true,
      config,
      shareableUrl: fullUrl,
    });
  } catch (err: any) {
    console.error("GET private-link error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Passcode required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { enabled, token, note } = body;

    const currentConfig = await getPrivateLinkConfig();
    const updates: Record<string, any> = {};

    if (typeof enabled === "boolean") {
      updates.enabled = enabled;
    }

    if (typeof token === "string" && token.trim().length > 0) {
      // Clean token to alphanumeric & hyphens/underscores
      const cleanToken = token.trim().replace(/[^a-zA-Z0-9-_]/g, "");
      if (cleanToken.length < 3) {
        return NextResponse.json(
          { success: false, error: "Token must be at least 3 characters long." },
          { status: 400 }
        );
      }
      updates.token = cleanToken;
    }

    if (typeof note === "string") {
      updates.note = note.trim();
    }

    const updated = await savePrivateLinkConfig(updates, auth.identity.name);

    // Record audit log
    const statusText = updated.enabled ? "ENABLED" : "DISABLED";
    await recordAdminActivity({
      admin: auth.identity,
      action: "PRIVATE_LINK_UPDATED",
      notes: `Private registration link was ${statusText}. Token: "${updated.token}". Note: "${updated.note || "N/A"}"`,
    });

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "kobbydrive.com";
    const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const fullUrl = `${proto}://${host}/?access=${updated.token}`;

    return NextResponse.json({
      success: true,
      config: updated,
      shareableUrl: fullUrl,
      message: `Private registration link successfully ${statusText.toLowerCase()}.`,
    });
  } catch (err: any) {
    console.error("PATCH private-link error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
