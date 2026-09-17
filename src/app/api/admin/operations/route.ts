import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/auth";
import { recordAdminActivity } from "@/lib/activity-logger";

export async function GET(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";
    const supabase = getServiceSupabase();

    // Applications in training / approved for attendance & tests
    const { data: candidates } = await supabase
      .from("kbdr_applications")
      .select("id, application_number, surname, last_name, phone_number, electoral_area, id_number, training_purpose, status")
      .in("status", ["approved", "in_training", "completed"])
      .order("surname", { ascending: true })
      .range(0, 49999);

    return NextResponse.json({
      success: true,
      candidates: candidates || [],
    });
  } catch (err: any) {
    console.error("Operations API GET error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, payload } = body;

    // Log admin activity
    if (action === "LOG_FUEL_PURCHASE") {
      await recordAdminActivity({
        admin: auth.identity,
        action: "FUEL_PURCHASE_LOGGED",
        notes: `Logged fuel: ${payload.litresPurchased}L (GH₵${payload.amountGHS}) for vehicle ${payload.vehicleRegNumber} by ${payload.driverInstructorName}`,
      });
      return NextResponse.json({ success: true, message: "Fuel log recorded." });
    }

    if (action === "RECORD_MOCK_TEST") {
      await recordAdminActivity({
        admin: auth.identity,
        action: "MOCK_TEST_EVALUATION",
        notes: `Recorded Mock Test for ${payload.candidateName} (${payload.applicationNumber}): ${payload.overallVerdict.toUpperCase()} (Theory: ${payload.theoryScore}/50, Road: ${payload.roadDrivingScore}/50)`,
      });
      return NextResponse.json({ success: true, message: "Mock test recorded." });
    }

    if (action === "ISSUE_CERTIFICATE") {
      await recordAdminActivity({
        admin: auth.identity,
        action: "PROVISIONAL_CERT_ISSUED",
        notes: `Issued Provisional Certificate ${payload.certificateNumber} for ${payload.candidateName} (${payload.applicationNumber})`,
      });
      return NextResponse.json({ success: true, message: "Certificate issued." });
    }

    if (action === "RECORD_ATTENDANCE") {
      await recordAdminActivity({
        admin: auth.identity,
        action: "ATTENDANCE_ROLLCALL",
        notes: `Recorded attendance roll-call for ${payload.date} (${payload.shift}): ${payload.count} trainees marked.`,
      });
      return NextResponse.json({ success: true, message: "Attendance saved." });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Operations API POST error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
