import { NextRequest, NextResponse } from "next/server";
import { recordAdminActivity } from "@/lib/activity-logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      licenseNumber,
      courseModule,
      schedulePreference,
      experienceLevel,
      notes,
    } = body;

    if (!fullName || !phone || !courseModule) {
      return NextResponse.json(
        { success: false, error: "Full name, phone number, and selected module are required." },
        { status: 400 }
      );
    }

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const enrollmentRef = `CRS-2026-${randNum}`;

    try {
      await recordAdminActivity({
        admin: { id: "refresher-course", name: fullName, role: "system" },
        action: "REFRESHER_COURSE_REGISTRATION",
        notes: `Driver Refresher Course Enrollment (${enrollmentRef}) by ${fullName} (Tel: ${phone}, License: ${licenseNumber || "N/A"}). Module: "${courseModule}". Preferred Schedule: "${schedulePreference}".`,
      });
    } catch (e) {
      console.warn("Could not log course registration:", e);
    }

    return NextResponse.json({
      success: true,
      enrollmentRef,
      message: "Refresher course enrollment submitted successfully! Our training director will confirm your schedule via SMS.",
    });
  } catch (err: any) {
    console.error("Course registration error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process enrollment" },
      { status: 500 }
    );
  }
}
