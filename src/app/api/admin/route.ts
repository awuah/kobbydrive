import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { DashboardStats } from "@/lib/types";
import { sendApplicationApprovedSMS } from "@/lib/sms";
import { isValidAdminPasscode, getAdminFromRequest } from "@/lib/auth";
import { recordAdminActivity } from "@/lib/activity-logger";
import { parseTrainingDetails } from "@/lib/utils";

// Auth check via header or cookie using authorized passcodes
function isAuthenticated(req: NextRequest): boolean {
  const auth = getAdminFromRequest(req);
  return auth.isAuthenticated;
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Passcode is invalid or has been revoked." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const sort = searchParams.get("sort") || "desc";

    const supabase = getServiceSupabase();

    // 1. Single Application Detailed View (with signature and audit logs)
    if (id) {
      const { data: application, error: appError } = await supabase
        .from("kbdr_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (appError) {
        return NextResponse.json({ success: false, error: appError.message }, { status: 404 });
      }

      const { data: logs } = await supabase
        .from("kbdr_application_logs")
        .select("*")
        .eq("application_id", id)
        .order("created_at", { ascending: false });

      const { purpose, schedule, is_employed } = parseTrainingDetails(application.training_purpose);
      const mappedApplication = {
        ...application,
        training_purpose: purpose,
        training_schedule: schedule,
        is_employed,
      };

      return NextResponse.json(
        {
          success: true,
          data: mappedApplication,
          logs: logs || [],
        },
        { status: 200 }
      );
    }

    // 2. Applications Listing (with server-side pagination & lightweight projection)
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limitParam = searchParams.get("limit");
    const isAll = limitParam === "all";
    const limit = isAll ? 50000 : parseInt(limitParam || "50", 10) || 50;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const listFields = `
      id,
      application_number,
      surname,
      last_name,
      title,
      gender,
      id_type,
      id_number,
      date_of_birth,
      place_of_birth,
      postal_address,
      house_number,
      house_address,
      nationality,
      email,
      phone_number,
      electoral_area,
      training_purpose,
      passport_photo,
      status,
      admin_notes,
      created_at,
      updated_at
    `;

    const isAscending = sort === "asc" || sort === "oldest";
    let query = supabase
      .from("kbdr_applications")
      .select(listFields, { count: "exact" })
      .order("created_at", { ascending: isAscending });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search.trim()) {
      const s = `%${search.trim()}%`;
      query = query.or(
        `surname.ilike.${s},last_name.ilike.${s},application_number.ilike.${s},phone_number.ilike.${s},email.ilike.${s},id_number.ilike.${s}`
      );
    }

    if (isAll) {
      query = query.range(0, 49999);
    } else {
      query = query.range(from, to);
    }

    const { data: applications, count, error } = await query;

    if (error) {
      console.error("Fetch applications error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Calculate dashboard statistics across all records without 1000 row limit
    const { data: allStatsRows, count: totalDbCount } = await supabase
      .from("kbdr_applications")
      .select("status, created_at", { count: "exact" })
      .range(0, 49999);

    const todayStr = new Date().toISOString().split("T")[0];

    const stats: DashboardStats = {
      total: totalDbCount ?? allStatsRows?.length ?? 0,
      pending: 0,
      under_review: 0,
      approved: 0,
      in_training: 0,
      completed: 0,
      rejected: 0,
      todayCount: 0,
    };

    if (allStatsRows) {
      allStatsRows.forEach((row) => {
        const s = row.status as keyof Omit<DashboardStats, "total" | "todayCount">;
        if (s && stats[s] !== undefined) {
          stats[s]++;
        }
        if (row.created_at && row.created_at.startsWith(todayStr)) {
          stats.todayCount++;
        }
      });
    }

    const totalCount = count ?? applications?.length ?? 0;

    const mappedApplications = (applications || []).map((app) => {
      const { purpose, schedule, is_employed } = parseTrainingDetails(app.training_purpose);
      return {
        ...app,
        training_purpose: purpose,
        training_schedule: schedule,
        is_employed,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: mappedApplications,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        stats,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Admin GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Passcode is invalid or has been revoked." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, status, admin_notes, action, batchIds, training_schedule } = body;

    const supabase = getServiceSupabase();

    // Handle batch schedule updates
    if (batchIds && Array.isArray(batchIds) && training_schedule !== undefined) {
      const { data: batchApps } = await supabase
        .from("kbdr_applications")
        .select("id, training_purpose, application_number")
        .in("id", batchIds);

      for (const app of (batchApps || [])) {
        const details = parseTrainingDetails(app.training_purpose);
        const updatedPurpose = `${details.purpose} || Schedule: ${training_schedule} || Employed: ${details.is_employed || "No"}`;
        await supabase
          .from("kbdr_applications")
          .update({
            training_purpose: updatedPurpose,
            updated_at: new Date().toISOString(),
          })
          .eq("id", app.id);
      }

      await recordAdminActivity({
        admin: auth.identity,
        action: "BATCH_SCHEDULE_ASSIGNMENT",
        notes: `Assigned schedule "${training_schedule}" to ${batchIds.length} candidate(s).`,
      });

      return NextResponse.json({ success: true, message: `Assigned schedule to ${batchIds.length} candidate(s).` });
    }

    // Handle batch status updates
    if (batchIds && Array.isArray(batchIds) && status) {
      let candidatesToNotify: any[] = [];
      const { data: batchApps } = await supabase
        .from("kbdr_applications")
        .select("id, title, surname, last_name, phone_number, application_number, status")
        .in("id", batchIds);

      if (status === "approved") {
        candidatesToNotify = (batchApps || []).filter((app) => app.status !== "approved");
      }

      const batchPayload: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (admin_notes !== undefined) {
        batchPayload.admin_notes = admin_notes;
      }

      const { error } = await supabase
        .from("kbdr_applications")
        .update(batchPayload)
        .in("id", batchIds);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // Record Activity Log for batch update
      const appNumbers = (batchApps || []).map((a) => a.application_number).slice(0, 5).join(", ");
      const batchActionType = status === "approved" ? "BATCH_APPROVED" : status === "rejected" ? "BATCH_REJECTED" : "BATCH_STATUS_UPDATE";
      const batchNote = status === "rejected"
        ? `Rejection Reason: ${admin_notes || "Unspecified"} (Batch of ${batchIds.length} candidate(s): ${appNumbers}${batchIds.length > 5 ? "..." : ""})`
        : `Batch updated ${batchIds.length} candidate(s) to "${status}". Refs: ${appNumbers}${batchIds.length > 5 ? "..." : ""}`;

      await recordAdminActivity({
        admin: auth.identity,
        action: batchActionType,
        newStatus: status,
        notes: batchNote,
      });

      // Dispatch approval SMS to all newly approved candidates
      if (status === "approved" && candidatesToNotify.length > 0) {
        for (const cand of candidatesToNotify) {
          try {
            if (cand.phone_number) {
              const smsRes = await sendApplicationApprovedSMS({
                title: cand.title,
                surname: cand.surname,
                last_name: cand.last_name,
                phone_number: cand.phone_number,
                application_number: cand.application_number,
              });

              await supabase.from("kbdr_application_logs").insert([
                {
                  application_id: cand.id,
                  action: "sms_sent",
                  notes: smsRes.success
                    ? `Approval SMS sent to ${cand.phone_number} via KOBBYMP.`
                    : `Approval SMS attempt: ${smsRes.error || "Failed"}`,
                  performed_by: "system",
                },
              ]);
            }
          } catch (bErr) {
            console.error(`Batch approval SMS error for ${cand.id}:`, bErr);
          }
        }
      }

      return NextResponse.json({ success: true, message: `Updated ${batchIds.length} records.` });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Application ID is required" }, { status: 400 });
    }

    // Fetch existing status for audit logging
    const { data: currentApp } = await supabase
      .from("kbdr_applications")
      .select("status, title, surname, last_name, phone_number, application_number")
      .eq("id", id)
      .single();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (admin_notes !== undefined) updatePayload.admin_notes = admin_notes;

    const { data, error } = await supabase
      .from("kbdr_applications")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const candidateName = `${currentApp?.title || ""} ${currentApp?.surname || ""} ${currentApp?.last_name || ""}`.trim();
    const actionType =
      status === "approved"
        ? "APPLICATION_APPROVED"
        : status === "rejected"
        ? "APPLICATION_REJECTED"
        : admin_notes && !status
        ? "NOTES_UPDATED"
        : "STATUS_CHANGED";

    const logNotes = status === "rejected"
      ? `Rejection Reason: ${admin_notes || "No reason specified"}`
      : admin_notes || `Status changed from ${currentApp?.status || "pending"} to ${status || currentApp?.status}`;

    // Record Activity Log
    await recordAdminActivity({
      admin: auth.identity,
      action: actionType,
      applicationId: id,
      applicationNumber: currentApp?.application_number,
      candidateName,
      previousStatus: currentApp?.status || null,
      newStatus: status || currentApp?.status,
      notes: logNotes,
    });

    // Send approval SMS if status transitioned to approved
    if (status === "approved" && currentApp?.status !== "approved") {
      const recipientPhone = data?.phone_number || currentApp?.phone_number;
      if (recipientPhone) {
        try {
          const smsRes = await sendApplicationApprovedSMS({
            title: data?.title || currentApp?.title,
            surname: data?.surname || currentApp?.surname,
            last_name: data?.last_name || currentApp?.last_name,
            phone_number: recipientPhone,
            application_number: data?.application_number || currentApp?.application_number,
          });

          await supabase.from("kbdr_application_logs").insert([
            {
              application_id: id,
              action: "sms_sent",
              notes: smsRes.success
                ? `Approval SMS sent to ${recipientPhone} via KOBBYMP.`
                : `Approval SMS attempt: ${smsRes.error || "Failed"}`,
              performed_by: "system",
            },
          ]);
        } catch (smsErr) {
          console.error("Approval SMS trigger error:", smsErr);
        }
      }
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAdminFromRequest(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Passcode is invalid or has been revoked." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Fetch before delete for log trail
    const { data: targetApp } = await supabase
      .from("kbdr_applications")
      .select("application_number, title, surname, last_name")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("kbdr_applications").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Record Activity Log
    if (targetApp) {
      const candidateName = `${targetApp.title || ""} ${targetApp.surname || ""} ${targetApp.last_name || ""}`.trim();
      await recordAdminActivity({
        admin: auth.identity,
        action: "APPLICATION_DELETED",
        applicationId: id,
        applicationNumber: targetApp.application_number,
        candidateName,
        notes: `Application dossier ${targetApp.application_number} (${candidateName}) was permanently deleted.`,
      });
    }

    return NextResponse.json({ success: true, message: "Application deleted successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
