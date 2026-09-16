import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/auth";
import { recordAdminActivity } from "@/lib/activity-logger";
import {
  TrainingCohort,
  TrainingScheduleType,
  Application
} from "@/lib/types";
import {
  createDefaultCohort,
  calculate3WeekCohortDates,
  MAX_COHORT_CAPACITY,
  MAX_SLOT_CAPACITY,
  getSlotKeyFromSchedule
} from "@/lib/schedule-manager";

// We store cohort records either in supabase settings / metadata or dynamically built from application records
// For full persistence and synchronization, let's keep cohort structure synced with kbdr_applications

export async function GET(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated || !auth.isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Schedule Management is restricted to Super Admins." },
        { status: 403 }
      );
    }

    const supabase = getServiceSupabase();

    // Fetch all approved and in_training applications
    const { data: applications, error } = await supabase
      .from("kbdr_applications")
      .select("id, application_number, surname, last_name, title, gender, phone_number, email, electoral_area, id_number, training_purpose, status, created_at, updated_at")
      .in("status", ["approved", "in_training"])
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      applications: applications || []
    });
  } catch (err: any) {
    console.error("Schedule API GET error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated || !auth.isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Schedule Management is restricted to Super Admins." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, applicantIds, cohortName, slotLabel, startDate, endDate, cohortId } = body;

    const supabase = getServiceSupabase();

    if (action === "ASSIGN_TO_COHORT") {
      if (!applicantIds || !Array.isArray(applicantIds) || applicantIds.length === 0) {
        return NextResponse.json({ success: false, error: "No applicants selected" }, { status: 400 });
      }

      // Update training_purpose to contain formatted cohort and schedule
      // Format: "Personal | [Cohort Name] | [Slot Label]"
      for (const appId of applicantIds) {
        const { data: currentApp } = await supabase
          .from("kbdr_applications")
          .select("training_purpose, surname, last_name, application_number")
          .eq("id", appId)
          .single();

        let basePurpose = "Personal";
        if (currentApp?.training_purpose) {
          const parts = currentApp.training_purpose.split("|");
          basePurpose = parts[0].trim() || "Personal";
        }

        const newPurpose = `${basePurpose} | ${cohortName} | ${slotLabel}`;

        await supabase
          .from("kbdr_applications")
          .update({
            training_purpose: newPurpose,
            status: "approved",
            updated_at: new Date().toISOString()
          })
          .eq("id", appId);
      }

      await recordAdminActivity({
        admin: auth.identity,
        action: "COHORT_ASSIGNMENT",
        notes: `Assigned ${applicantIds.length} candidate(s) to "${cohortName}" (${slotLabel})`,
      });

      return NextResponse.json({ success: true, count: applicantIds.length });
    }

    if (action === "UNASSIGN_FROM_COHORT") {
      if (!applicantIds || !Array.isArray(applicantIds)) {
        return NextResponse.json({ success: false, error: "No applicants specified" }, { status: 400 });
      }

      for (const appId of applicantIds) {
        const { data: currentApp } = await supabase
          .from("kbdr_applications")
          .select("training_purpose")
          .eq("id", appId)
          .single();

        let basePurpose = "Personal";
        if (currentApp?.training_purpose) {
          const parts = currentApp.training_purpose.split("|");
          basePurpose = parts[0].trim() || "Personal";
        }

        const newPurpose = `${basePurpose} | unscheduled`;

        await supabase
          .from("kbdr_applications")
          .update({
            training_purpose: newPurpose,
            updated_at: new Date().toISOString()
          })
          .eq("id", appId);
      }

      await recordAdminActivity({
        admin: auth.identity,
        action: "COHORT_UNASSIGNMENT",
        notes: `Unassigned ${applicantIds.length} candidate(s) from cohort`,
      });

      return NextResponse.json({ success: true, count: applicantIds.length });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Schedule API POST error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
