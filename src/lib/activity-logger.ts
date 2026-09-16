import { getServiceSupabase } from "@/lib/supabase";
import { AdminIdentity } from "@/lib/auth";
import { AdminActivityLog } from "@/lib/types";

export interface RecordActivityParams {
  admin: AdminIdentity;
  action:
    | "APPLICATION_APPROVED"
    | "APPLICATION_REJECTED"
    | "STATUS_CHANGED"
    | "BATCH_APPROVED"
    | "BATCH_STATUS_UPDATE"
    | "NOTES_UPDATED"
    | "APPLICATION_DELETED"
    | "EXPORT_CSV"
    | "ADMIN_LOGIN"
    | string;
  applicationId?: string | null;
  applicationNumber?: string | null;
  candidateName?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
  notes?: string | null;
  ipAddress?: string | null;
}

/**
 * Records an administrative activity performed by one of the admin users or superadmin
 */
export async function recordAdminActivity(params: RecordActivityParams): Promise<boolean> {
  try {
    const supabase = getServiceSupabase();
    const timestamp = new Date().toISOString();

    const logEntry = {
      admin_id: params.admin.id,
      admin_name: params.admin.name,
      admin_code: params.admin.code || "N/A",
      action: params.action,
      application_id: params.applicationId || null,
      application_number: params.applicationNumber || null,
      candidate_name: params.candidateName || null,
      previous_status: params.previousStatus || null,
      new_status: params.newStatus || null,
      notes: params.notes || null,
      ip_address: params.ipAddress || null,
      created_at: timestamp,
    };

    // 1. Attempt writing to dedicated kbdr_admin_activity_logs
    const { error: adminLogError } = await supabase
      .from("kbdr_admin_activity_logs")
      .insert([logEntry]);

    if (adminLogError) {
      console.warn("Notice: kbdr_admin_activity_logs insert:", adminLogError.message);
    }

    // 2. If an application ID is linked, also mirror to kbdr_application_logs
    if (params.applicationId) {
      await supabase.from("kbdr_application_logs").insert([
        {
          application_id: params.applicationId,
          action: params.action.toLowerCase(),
          previous_status: params.previousStatus || null,
          new_status: params.newStatus || null,
          notes: params.notes || `Action ${params.action} performed by ${params.admin.name}`,
          performed_by: params.admin.name,
          created_at: timestamp,
        },
      ]);
    }

    return true;
  } catch (err) {
    console.error("Failed to record admin activity:", err);
    return false;
  }
}

/**
 * Retrieves paginated activity logs for Superadmin inspection
 */
export async function getAdminActivityLogs(options: {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
  search?: string;
}): Promise<{
  logs: AdminActivityLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  adminStats: Record<string, number>;
}> {
  const supabase = getServiceSupabase();
  const page = options.page || 1;
  const limit = options.limit || 50;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Attempt querying kbdr_admin_activity_logs
    let query = supabase
      .from("kbdr_admin_activity_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options.adminId && options.adminId !== "all") {
      query = query.eq("admin_id", options.adminId);
    }

    if (options.action && options.action !== "all") {
      if (options.action === "REJECTIONS") {
        query = query.in("action", ["APPLICATION_REJECTED", "BATCH_REJECTED"]);
      } else if (options.action === "APPROVALS") {
        query = query.in("action", ["APPLICATION_APPROVED", "BATCH_APPROVED"]);
      } else {
        query = query.eq("action", options.action);
      }
    }

    if (options.search && options.search.trim()) {
      const s = `%${options.search.trim()}%`;
      query = query.or(
        `admin_name.ilike.${s},candidate_name.ilike.${s},application_number.ilike.${s},notes.ilike.${s},action.ilike.${s}`
      );
    }

    query = query.range(from, to);

    const { data: logs, count, error } = await query;

    if (!error && logs) {
      // Calculate per-admin stats
      const { data: allAdminLogs } = await supabase
        .from("kbdr_admin_activity_logs")
        .select("admin_id");

      const adminStats: Record<string, number> = {
        admin_1: 0,
        admin_2: 0,
        admin_3: 0,
        admin_4: 0,
        superadmin: 0,
        other: 0,
      };

      if (allAdminLogs) {
        allAdminLogs.forEach((row) => {
          if (row.admin_id && adminStats[row.admin_id] !== undefined) {
            adminStats[row.admin_id]++;
          } else {
            adminStats.other++;
          }
        });
      }

      const totalCount = count ?? logs.length ?? 0;
      return {
        logs: logs as AdminActivityLog[],
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        adminStats,
      };
    }
  } catch (err) {
    console.warn("Primary log query fallback trigger:", err);
  }

  // Fallback: Query kbdr_application_logs joined with kbdr_applications
  try {
    const { data: appLogs } = await supabase
      .from("kbdr_application_logs")
      .select("*, kbdr_applications(application_number, surname, last_name, title)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (appLogs) {
      const mappedLogs: AdminActivityLog[] = appLogs.map((l: any) => {
        const app = l.kbdr_applications;
        const candName = app ? `${app.title || ""} ${app.surname || ""} ${app.last_name || ""}`.trim() : "Candidate";
        return {
          id: l.id,
          admin_id: l.performed_by?.includes("Admin 1") ? "admin_1" :
                    l.performed_by?.includes("Admin 2") ? "admin_2" :
                    (l.performed_by?.includes("Admin 3") || l.performed_by?.includes("Emma Avidor")) ? "admin_3" :
                    l.performed_by?.includes("Admin 4") ? "admin_4" :
                    l.performed_by?.includes("Super") ? "superadmin" : "admin",
          admin_name: l.performed_by || "Admin",
          action: l.action.toUpperCase(),
          application_id: l.application_id,
          application_number: app?.application_number || null,
          candidate_name: candName,
          previous_status: l.previous_status,
          new_status: l.new_status,
          notes: l.notes,
          created_at: l.created_at,
        };
      });

      return {
        logs: mappedLogs,
        total: mappedLogs.length,
        page: 1,
        limit: 50,
        totalPages: 1,
        adminStats: { admin_1: 0, admin_2: 0, admin_3: 0, admin_4: 0, superadmin: 0, other: 0 },
      };
    }
  } catch (fErr) {
    console.error("Fallback logs error:", fErr);
  }

  return {
    logs: [],
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
    adminStats: { admin_1: 0, admin_2: 0, admin_3: 0, admin_4: 0, superadmin: 0, other: 0 },
  };
}
