import { NextRequest, NextResponse } from "next/server";
import { isBypassTokenValid, getPrivateLinkConfig } from "@/lib/private-link";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token =
      searchParams.get("token") ||
      searchParams.get("access") ||
      searchParams.get("invite") ||
      searchParams.get("bypass") ||
      searchParams.get("vip") ||
      "";

    if (!token) {
      return NextResponse.json({ valid: false, error: "No token provided." }, { status: 400 });
    }

    const config = await getPrivateLinkConfig();

    if (!config.enabled) {
      return NextResponse.json({
        valid: false,
        error: "This private registration link is currently disabled by the administrator.",
      });
    }

    const valid = await isBypassTokenValid(token);

    return NextResponse.json({
      valid,
      token: valid ? token : undefined,
      message: valid
        ? "Private registration bypass link is active and authorized."
        : "Invalid or expired registration access token.",
    });
  } catch (err: any) {
    console.error("Error in verify-bypass route:", err);
    return NextResponse.json(
      { valid: false, error: "Unable to verify private link at this time." },
      { status: 500 }
    );
  }
}
