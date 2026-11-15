import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import {
  getTheoryInvitations,
  saveTheoryInvitations,
  getTheoryResults,
  TheoryInvitation,
} from "@/lib/theory-store";
import { sendTheoryTestInvitationSMS } from "@/lib/sms";
import { recordAdminActivity } from "@/lib/activity-logger";

export async function GET(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const invitations = await getTheoryInvitations();
    const results = await getTheoryResults();

    return NextResponse.json({
      success: true,
      invitations,
      results,
    });
  } catch (err: any) {
    console.error("GET /api/theory/admin error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, applicantIds, sendSms, customNote } = body;

    const supabase = getServiceSupabase();

    if (action === "INVITE_APPLICANTS" && Array.isArray(applicantIds) && applicantIds.length > 0) {
      // Fetch selected applicants
      const { data: applicants, error: fetchErr } = await supabase
        .from("kbdr_applications")
        .select("id, application_number, surname, last_name, title, phone_number, status, electoral_area")
        .in("id", applicantIds);

      if (fetchErr) {
        return NextResponse.json({ success: false, error: fetchErr.message }, { status: 500 });
      }

      const existingInvitations = await getTheoryInvitations();
      const existingMap = new Map(existingInvitations.map((i) => [i.applicationId, i]));

      let newlyInvitedCount = 0;
      let smsSentCount = 0;

      // Construct test URL
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "kobbydrive.com";
      const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");

      for (const app of applicants || []) {
        const candidateName = `${app.title ? app.title + " " : ""}${app.surname} ${app.last_name}`.trim();
        const testUrl = `${proto}://${host}/theory-test?ref=${encodeURIComponent(app.application_number)}`;

        if (existingMap.has(app.id)) {
          // Update existing invitation
          const item = existingMap.get(app.id)!;
          item.status = item.status === "passed" ? "passed" : "invited";
          item.invitedAt = new Date().toISOString();
          item.invitedBy = auth.identity.name;
        } else {
          // Create new invitation
          const newInv: TheoryInvitation = {
            id: `inv_${app.id}_${Date.now()}`,
            applicationId: app.id,
            applicationNumber: app.application_number,
            candidateName,
            phoneNumber: app.phone_number,
            invitedAt: new Date().toISOString(),
            invitedBy: auth.identity.name,
            status: "invited",
            attemptsCount: 0,
            bestScorePercentage: 0,
            notes: customNote || "Invited by admin for theory testing batch",
          };
          existingInvitations.push(newInv);
          existingMap.set(app.id, newInv);
          newlyInvitedCount++;
        }

        // Tag applicant note in kbdr_applications as theory_invited
        await supabase
          .from("kbdr_applications")
          .update({
            admin_notes: `[Theory Test Invited on ${new Date().toLocaleDateString("en-GB")}]`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", app.id);

        // Optionally send invitation SMS
        if (sendSms && app.phone_number) {
          try {
            const smsRes = await sendTheoryTestInvitationSMS({
              name: candidateName,
              phone_number: app.phone_number,
              application_number: app.application_number,
              testUrl,
            });
            if (smsRes.success) smsSentCount++;
          } catch (smsErr) {
            console.warn(`SMS send failed for ${app.phone_number}:`, smsErr);
          }
        }
      }

      await saveTheoryInvitations(existingInvitations);

      // Audit Log
      await recordAdminActivity({
        admin: auth.identity,
        action: "THEORY_TEST_INVITATION_BATCH",
        notes: `Invited ${applicantIds.length} candidate(s) to take the Ghana Drivers Guide Theory Examination. SMS Dispatched: ${smsSentCount}.`,
      });

      return NextResponse.json({
        success: true,
        message: `Successfully invited ${applicantIds.length} candidate(s) to take the Theory Exam. ${
          sendSms ? `(${smsSentCount} SMS notifications dispatched)` : ""
        }`,
      });
    }

    if (action === "REVOKE_INVITATION" && body.applicationId) {
      const existingInvitations = await getTheoryInvitations();
      const updated = existingInvitations.filter((i) => i.applicationId !== body.applicationId);
      await saveTheoryInvitations(updated);

      await recordAdminActivity({
        admin: auth.identity,
        action: "THEORY_TEST_INVITATION_REVOKED",
        notes: `Revoked theory exam access for applicant ID ${body.applicationId}.`,
      });

      return NextResponse.json({ success: true, message: "Invitation revoked." });
    }

    return NextResponse.json({ success: false, error: "Invalid action or parameters." }, { status: 400 });
  } catch (err: any) {
    console.error("POST /api/theory/admin error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
