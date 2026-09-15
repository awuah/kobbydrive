"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminActivityLog } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import {
  ShieldAlert,
  Search,
  RefreshCw,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Activity,
  Layers,
  FileSpreadsheet,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Crown,
} from "lucide-react";

interface AdminActivityLogsProps {
  passcode: string;
}

export default function AdminActivityLogs({ passcode }: AdminActivityLogsProps) {
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedAdminId, setSelectedAdminId] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Admin stats
  const [adminStats, setAdminStats] = useState<Record<string, number>>({
    admin_1: 0,
    admin_2: 0,
    admin_3: 0,
    admin_4: 0,
    superadmin: 0,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());
      if (selectedAdminId !== "all") params.append("adminId", selectedAdminId);
      if (selectedAction !== "all") params.append("action", selectedAction);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/admin/logs?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${passcode}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch activity logs");
      }

      setLogs(data.logs || []);
      setTotalLogs(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.adminStats) {
        setAdminStats(data.adminStats);
      }
    } catch (err: any) {
      console.error("Activity log load error:", err);
      setError(err.message || "Failed to load activity logs.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedAdminId, selectedAction, searchQuery, passcode]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case "APPLICATION_APPROVED":
      case "BATCH_APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
          </span>
        );
      case "APPLICATION_REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
          </span>
        );
      case "STATUS_CHANGED":
      case "BATCH_STATUS_UPDATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Activity className="w-3 h-3 text-blue-600" /> Status Changed
          </span>
        );
      case "NOTES_UPDATED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Edit3 className="w-3 h-3 text-amber-600" /> Notes Updated
          </span>
        );
      case "APPLICATION_DELETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <Trash2 className="w-3 h-3 text-red-600" /> Deleted
          </span>
        );
      case "EXPORT_CSV":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <FileSpreadsheet className="w-3 h-3 text-purple-600" /> CSV Export
          </span>
        );
      case "ADMIN_LOGIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Clock className="w-3 h-3 text-indigo-600" /> Logged In
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {action.replace(/_/g, " ")}
          </span>
        );
    }
  };

  const getAdminBadge = (log: AdminActivityLog) => {
    const adminId = log.admin_id;
    if (adminId === "superadmin" || log.admin_name.toLowerCase().includes("super")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-400/40">
          <Crown className="w-3 h-3 text-amber-600" /> Super Admin
        </span>
      );
    }
    if (adminId === "admin_1" || log.admin_name.includes("Admin 1")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <User className="w-3 h-3 text-blue-600" /> Admin 1 (KBD9482ADMN)
        </span>
      );
    }
    if (adminId === "admin_2" || log.admin_name.includes("Admin 2")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
          <User className="w-3 h-3 text-purple-600" /> Admin 2 (TAK7261DRVE)
        </span>
      );
    }
    if (adminId === "admin_3" || log.admin_name.includes("Admin 3")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <User className="w-3 h-3 text-amber-600" /> Admin 3 (FREE8394DRV)
        </span>
      );
    }
    if (adminId === "admin_4" || log.admin_name.includes("Admin 4")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
          <User className="w-3 h-3 text-indigo-600" /> Admin 4 (MP6153KOBBY)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
        <User className="w-3 h-3 text-slate-500" /> {log.admin_name || "Admin"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Superadmin Exclusive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
              <Crown className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-black tracking-tight">Superadmin Activity Audit Trail</h2>
          </div>
          <p className="text-xs text-slate-300">
            Monitoring actions, status transitions, approvals & rejections performed across all 4 assigned admin passcodes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm border border-slate-600"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Activity Log
        </button>
      </div>

      {/* Admin User Activity Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setSelectedAdminId("admin_1")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedAdminId === "admin_1"
              ? "bg-blue-500 text-white border-blue-600 shadow-md ring-2 ring-blue-400"
              : "bg-white hover:bg-blue-50/50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Admin 1</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10">KBD9482ADMN</span>
          </div>
          <div className="text-2xl font-black mt-2">{adminStats.admin_1 || 0}</div>
          <span className="text-[10px] opacity-75 font-semibold">Total logged actions</span>
        </div>

        <div
          onClick={() => setSelectedAdminId("admin_2")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedAdminId === "admin_2"
              ? "bg-purple-500 text-white border-purple-600 shadow-md ring-2 ring-purple-400"
              : "bg-white hover:bg-purple-50/50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Admin 2</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10">TAK7261DRVE</span>
          </div>
          <div className="text-2xl font-black mt-2">{adminStats.admin_2 || 0}</div>
          <span className="text-[10px] opacity-75 font-semibold">Total logged actions</span>
        </div>

        <div
          onClick={() => setSelectedAdminId("admin_3")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedAdminId === "admin_3"
              ? "bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400"
              : "bg-white hover:bg-amber-50/50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Admin 3</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10">FREE8394DRV</span>
          </div>
          <div className="text-2xl font-black mt-2">{adminStats.admin_3 || 0}</div>
          <span className="text-[10px] opacity-75 font-semibold">Total logged actions</span>
        </div>

        <div
          onClick={() => setSelectedAdminId("admin_4")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedAdminId === "admin_4"
              ? "bg-indigo-500 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400"
              : "bg-white hover:bg-indigo-50/50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Admin 4</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10">MP6153KOBBY</span>
          </div>
          <div className="text-2xl font-black mt-2">{adminStats.admin_4 || 0}</div>
          <span className="text-[10px] opacity-75 font-semibold">Total logged actions</span>
        </div>

        <div
          onClick={() => setSelectedAdminId("all")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            selectedAdminId === "all"
              ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-400"
              : "bg-white hover:bg-slate-100 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">All Admins</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10">Combined</span>
          </div>
          <div className="text-2xl font-black mt-2">{totalLogs}</div>
          <span className="text-[10px] opacity-75 font-semibold">All Recorded Events</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search logs by admin, candidate, ref, or action..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </div>

          <select
            value={selectedAdminId}
            onChange={(e) => {
              setSelectedAdminId(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Admin Passcodes</option>
            <option value="admin_1">Admin 1 (KBD9482ADMN)</option>
            <option value="admin_2">Admin 2 (TAK7261DRVE)</option>
            <option value="admin_3">Admin 3 (FREE8394DRV)</option>
            <option value="admin_4">Admin 4 (MP6153KOBBY)</option>
            <option value="superadmin">Super Admin</option>
          </select>

          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Action Types</option>
            <option value="REJECTIONS">❌ Rejections (Single & Batch)</option>
            <option value="APPROVALS">✅ Approvals (Single & Batch)</option>
            <option value="STATUS_CHANGED">Status Changes</option>
            <option value="NOTES_UPDATED">Notes Updates</option>
            <option value="EXPORT_CSV">CSV Exports</option>
            <option value="APPLICATION_DELETED">Deletions</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin Performed By</th>
                <th className="p-4">Action</th>
                <th className="p-4">Candidate / Application</th>
                <th className="p-4">Transition</th>
                <th className="p-4">Activity Details & Remarks</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 text-brand-600 animate-spin mx-auto mb-2" />
                    <span>Loading audit activity log...</span>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{formatDateTime(log.created_at)}</div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {getAdminBadge(log)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>

                    <td className="p-4">
                      {log.application_number ? (
                        <div>
                          <span className="font-mono font-bold text-slate-900 block">
                            {log.application_number}
                          </span>
                          {log.candidate_name && (
                            <span className="text-slate-600 text-[11px] block truncate max-w-[180px]">
                              {log.candidate_name}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">System Wide</span>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {log.new_status ? (
                        <div className="flex items-center gap-1.5">
                          {log.previous_status && (
                            <span className="text-slate-400 line-through text-[11px]">
                              {log.previous_status}
                            </span>
                          )}
                          <span className="text-slate-400">→</span>
                          <span className="font-bold text-slate-900 text-xs">
                            {log.new_status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="p-4 max-w-md">
                      {log.action.includes("REJECT") || log.notes?.toLowerCase().includes("rejection reason") ? (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-950 text-xs shadow-xs">
                          <span className="font-extrabold text-rose-700 flex items-center gap-1 mb-0.5 text-[11px] uppercase tracking-wider">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 inline" /> Rejection Reason:
                          </span>
                          <span className="font-medium text-slate-900 block">
                            {log.notes?.replace(/^Rejection Reason:\s*/i, "") || "No reason specified"}
                          </span>
                        </div>
                      ) : (
                        <p className="text-slate-800 text-xs line-clamp-2">
                          {log.notes || "No additional remarks"}
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 space-y-2">
                    <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">No activity logs recorded yet.</p>
                    <p className="text-xs">
                      When any of the 4 admin passcodes approve, reject, or modify applications, their actions will appear here in real-time.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-600">
            Showing <strong className="text-slate-900 font-bold">{totalLogs === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-slate-900 font-bold">{Math.min(currentPage * pageSize, totalLogs)}</strong> of{" "}
            <strong className="text-slate-900 font-bold">{totalLogs}</strong> recorded events
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <span className="text-xs font-bold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
