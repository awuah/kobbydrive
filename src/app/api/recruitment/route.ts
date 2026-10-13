import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { recordAdminActivity } from "@/lib/activity-logger";
import { DriverProfile, SAMPLE_DRIVERS } from "@/lib/recruitment";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    drivers: SAMPLE_DRIVERS,
    stats: {
      availableDrivers: 48,
      corporatePlacements: 126,
      averageRating: 4.9,
      placementSuccessRate: "98.4%",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      contactPerson,
      phone,
      email,
      roleCategory,
      salaryRangeGHS,
      packageTier,
      driverCount,
      notes,
    } = body;

    if (!companyName || !contactPerson || !phone) {
      return NextResponse.json(
        { success: false, error: "Company name, contact person, and phone number are required." },
        { status: 400 }
      );
    }

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const requestRef = `REC-2026-${randNum}`;

    // Record activity in system logs
    try {
      await recordAdminActivity({
        admin: { id: "public-portal", name: "Recruitment Portal", role: "system" },
        action: "RECRUITMENT_REQUEST_SUBMITTED",
        notes: `Private Sector Driver Placement Request (${requestRef}) from "${companyName}" (${contactPerson}, Tel: ${phone}). Role: ${roleCategory || "General"}, Tier: ${packageTier || "Standard"}.`,
      });
    } catch (e) {
      console.warn("Could not record recruitment activity:", e);
    }

    return NextResponse.json({
      success: true,
      requestRef,
      message: "Driver recruitment request received successfully. Our placement coordinator will contact you within 24 hours.",
    });
  } catch (err: any) {
    console.error("Recruitment POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
