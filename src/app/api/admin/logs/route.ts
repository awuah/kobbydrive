import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, isSuperAdminPasscode } from "@/lib/auth";
import { getAdminActivityLogs, recordAdminActivity } from "@/lib/activity-logger";

export async function GET(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);

    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    // STRICT ACCESS CONTROL: Only Superadmin passcode is authorized to view audit logs
    if (!auth.isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Access Denied: Activity audit logs are restricted exclusively to Superadmin.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limitParam = parseInt(searchParams.get("limit") || "50", 10);
    const limit = isNaN(limitParam) || limitParam < 1 ? 50 : limitParam;
    const adminId = searchParams.get("adminId") || "all";
    const action = searchParams.get("action") || "all";
    const search = searchParams.get("search") || "";

    const result = await getAdminActivityLogs({
      page,
      limit,
      adminId,
      action,
      search,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
        viewer: auth.identity,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Admin logs GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);

    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, notes, applicationId, applicationNumber, candidateName } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required." },
        { status: 400 }
      );
    }

    await recordAdminActivity({
      admin: auth.identity,
      action: action.toUpperCase(),
      applicationId,
      applicationNumber,
      candidateName,
      notes,
    });

    return NextResponse.json({ success: true, message: "Activity logged." });
  } catch (err: any) {
    console.error("Admin logs POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
