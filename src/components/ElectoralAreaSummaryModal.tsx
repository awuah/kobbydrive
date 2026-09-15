"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Printer,
  Download,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Users,
  RefreshCw,
  TrendingUp,
  MapPin,
  AlertCircle,
} from "lucide-react";

interface AreaStats {
  area: string;
  registered: number;
  approved: number;
  in_training: number;
  completed: number;
  trained: number; // approved + in_training + completed
  rejected: number;
  pending: number;
}

interface SummaryTotals {
  totalRegistered: number;
  totalTrained: number;
  totalApproved: number;
  totalInTraining: number;
  totalCompleted: number;
  totalRejected: number;
  totalPending: number;
}

interface ElectoralAreaSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  passcode: string;
}

export default function ElectoralAreaSummaryModal({
  isOpen,
  onClose,
  passcode,
}: ElectoralAreaSummaryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<SummaryTotals>({
    totalRegistered: 0,
    totalTrained: 0,
    totalApproved: 0,
    totalInTraining: 0,
    totalCompleted: 0,
    totalRejected: 0,
    totalPending: 0,
  });
  const [breakdown, setBreakdown] = useState<AreaStats[]>([]);
  const [sortBy, setSortBy] = useState<"registered" | "trained" | "rejected" | "area">("registered");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchSummary = useCallback(async () => {
    if (!isOpen || !passcode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/summary", {
        headers: {
          Authorization: `Bearer ${passcode}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTotals(data.summary);
        setBreakdown(data.breakdown || []);
      } else {
        setError(data.error || "Failed to load summary statistics.");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading summary report.");
    } finally {
      setLoading(false);
    }
  }, [isOpen, passcode]);

  useEffect(() => {
    if (isOpen) {
      fetchSummary();
    }
  }, [isOpen, fetchSummary]);

  if (!isOpen) return null;

  // Sorting
  const sortedBreakdown = [...breakdown].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "registered") comparison = a.registered - b.registered;
    else if (sortBy === "trained") comparison = a.trained - b.trained;
    else if (sortBy === "rejected") comparison = a.rejected - b.rejected;
    else if (sortBy === "area") comparison = a.area.localeCompare(b.area);

    return sortOrder === "desc" ? -comparison : comparison;
  });

  const toggleSort = (column: "registered" | "trained" | "rejected" | "area") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder(column === "area" ? "asc" : "desc");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!breakdown || breakdown.length === 0) return;

    const headers = [
      "Electoral Area",
      "Total Registered",
      "Trained / Approved",
      "In Training",
      "Completed",
      "Rejected",
      "Pending Review",
      "Trained %",
      "Rejected %",
      "Share of Total %",
    ];

    const rows = breakdown.map((item) => {
      const trainedPct = item.registered > 0 ? ((item.trained / item.registered) * 100).toFixed(1) : "0.0";
      const rejectedPct = item.registered > 0 ? ((item.rejected / item.registered) * 100).toFixed(1) : "0.0";
      const sharePct = totals.totalRegistered > 0 ? ((item.registered / totals.totalRegistered) * 100).toFixed(1) : "0.0";

      return [
        `"${item.area}"`,
        item.registered,
        item.approved,
        item.in_training,
        item.completed,
        item.rejected,
        item.pending,
        `"${trainedPct}%"`,
        `"${rejectedPct}%"`,
        `"${sharePct}%"`,
      ];
    });

    // Add Totals row
    const totalTrainedPct = totals.totalRegistered > 0 ? ((totals.totalTrained / totals.totalRegistered) * 100).toFixed(1) : "0.0";
    const totalRejectedPct = totals.totalRegistered > 0 ? ((totals.totalRejected / totals.totalRegistered) * 100).toFixed(1) : "0.0";
    rows.push([
      `"TOTAL (ALL ELECTORAL AREAS)"`,
      totals.totalRegistered,
      totals.totalApproved,
      totals.totalInTraining,
      totals.totalCompleted,
      totals.totalRejected,
      totals.totalPending,
      `"${totalTrainedPct}%"`,
      `"${totalRejectedPct}%"`,
      `"100.0%"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kobbydrive_electoral_summary_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Takoradi Electoral Area Summary
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  Live Report
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Constituency Breakdown: Total Registered, Trained & Rejected per Electoral Area
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={fetchSummary}
              disabled={loading}
              title="Refresh Data"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Top KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Registered</span>
                <Users className="w-4 h-4 text-brand-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {totals.totalRegistered.toLocaleString()}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">applicants</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> 16 Electoral Areas
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-700 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Trained / Approved</span>
                <GraduationCap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {totals.totalTrained.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-emerald-700">
                  {totals.totalRegistered > 0
                    ? `${((totals.totalTrained / totals.totalRegistered) * 100).toFixed(1)}%`
                    : "0%"}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-600/90 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Appr: {totals.totalApproved} | In Train: {totals.totalInTraining}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-200/80 bg-rose-50/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-rose-700 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Rejected</span>
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-rose-600">
                  {totals.totalRejected.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-rose-700">
                  {totals.totalRegistered > 0
                    ? `${((totals.totalRejected / totals.totalRegistered) * 100).toFixed(1)}%`
                    : "0%"}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-rose-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 rotate-180" /> With mandatory rejection reasons
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-700 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Pending / Review</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-600">
                  {totals.totalPending.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-amber-700">
                  {totals.totalRegistered > 0
                    ? `${((totals.totalPending / totals.totalRegistered) * 100).toFixed(1)}%`
                    : "0%"}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-amber-600/90 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Awaiting admin review
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  Electoral Area Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Showing all electoral areas in Takoradi constituency
                </p>
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Sort by:</span>
                <button
                  onClick={() => toggleSort("registered")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    sortBy === "registered"
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Registered {sortBy === "registered" && (sortOrder === "desc" ? "↓" : "↑")}
                </button>
                <button
                  onClick={() => toggleSort("trained")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    sortBy === "trained"
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Trained {sortBy === "trained" && (sortOrder === "desc" ? "↓" : "↑")}
                </button>
                <button
                  onClick={() => toggleSort("rejected")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    sortBy === "rejected"
                      ? "bg-rose-600 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Rejected {sortBy === "rejected" && (sortOrder === "desc" ? "↓" : "↑")}
                </button>
                <button
                  onClick={() => toggleSort("area")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    sortBy === "area"
                      ? "bg-brand-600 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Name {sortBy === "area" && (sortOrder === "desc" ? "↓" : "↑")}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Electoral Area</th>
                    <th className="py-3 px-4 text-center">Registered</th>
                    <th className="py-3 px-4 text-center text-emerald-700">Trained / Approved</th>
                    <th className="py-3 px-4 text-center text-rose-700">Rejected</th>
                    <th className="py-3 px-4 text-center text-amber-700">Pending</th>
                    <th className="py-3 px-4 w-44">Status Distribution</th>
                    <th className="py-3 px-4 text-right">% Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {sortedBreakdown.map((item, index) => {
                    const trainedRate =
                      item.registered > 0
                        ? Math.round((item.trained / item.registered) * 100)
                        : 0;
                    const rejectedRate =
                      item.registered > 0
                        ? Math.round((item.rejected / item.registered) * 100)
                        : 0;
                    const pendingRate =
                      item.registered > 0
                        ? Math.round((item.pending / item.registered) * 100)
                        : 0;
                    const shareRate =
                      totals.totalRegistered > 0
                        ? ((item.registered / totals.totalRegistered) * 100).toFixed(1)
                        : "0.0";

                    return (
                      <tr
                        key={item.area}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                          {item.area}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-slate-900 text-sm">
                          {item.registered}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {item.trained}
                            <span className="text-[10px] text-emerald-600 font-normal">
                              ({trainedRate}%)
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md border ${
                              item.rejected > 0
                                ? "text-rose-700 bg-rose-50 border-rose-200"
                                : "text-slate-400 bg-slate-50 border-slate-100 font-normal"
                            }`}
                          >
                            {item.rejected}
                            {item.rejected > 0 && (
                              <span className="text-[10px] text-rose-600 font-normal">
                                ({rejectedRate}%)
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md border ${
                              item.pending > 0
                                ? "text-amber-700 bg-amber-50 border-amber-200"
                                : "text-slate-400 bg-slate-50 border-slate-100 font-normal"
                            }`}
                          >
                            {item.pending}
                            {item.pending > 0 && (
                              <span className="text-[10px] text-amber-600 font-normal">
                                ({pendingRate}%)
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.registered > 0 ? (
                            <div className="w-full">
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                <div
                                  style={{ width: `${trainedRate}%` }}
                                  className="bg-emerald-500 h-full"
                                  title={`Trained: ${trainedRate}%`}
                                />
                                <div
                                  style={{ width: `${pendingRate}%` }}
                                  className="bg-amber-400 h-full"
                                  title={`Pending: ${pendingRate}%`}
                                />
                                <div
                                  style={{ width: `${rejectedRate}%` }}
                                  className="bg-rose-500 h-full"
                                  title={`Rejected: ${rejectedRate}%`}
                                />
                              </div>
                              <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                                <span className="text-emerald-600 font-medium">
                                  {trainedRate}% Trn
                                </span>
                                <span className="text-rose-600 font-medium">
                                  {rejectedRate}% Rej
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">No records</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-600">
                          {shareRate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Total Summary Footer */}
                <tfoot>
                  <tr className="bg-slate-900 text-white font-black text-xs border-t-2 border-slate-700">
                    <td className="py-3.5 px-4 text-center">∑</td>
                    <td className="py-3.5 px-4 uppercase tracking-wider">
                      Constituency Totals
                    </td>
                    <td className="py-3.5 px-4 text-center text-sm font-black text-white">
                      {totals.totalRegistered}
                    </td>
                    <td className="py-3.5 px-4 text-center text-emerald-400">
                      {totals.totalTrained}{" "}
                      <span className="text-[10px] text-emerald-300 font-normal">
                        (
                        {totals.totalRegistered > 0
                          ? ((totals.totalTrained / totals.totalRegistered) * 100).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-rose-400">
                      {totals.totalRejected}{" "}
                      <span className="text-[10px] text-rose-300 font-normal">
                        (
                        {totals.totalRegistered > 0
                          ? ((totals.totalRejected / totals.totalRegistered) * 100).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-amber-400">
                      {totals.totalPending}{" "}
                      <span className="text-[10px] text-amber-300 font-normal">
                        (
                        {totals.totalRegistered > 0
                          ? ((totals.totalPending / totals.totalRegistered) * 100).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          style={{
                            width: `${
                              totals.totalRegistered > 0
                                ? (totals.totalTrained / totals.totalRegistered) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-emerald-400 h-full"
                        />
                        <div
                          style={{
                            width: `${
                              totals.totalRegistered > 0
                                ? (totals.totalPending / totals.totalRegistered) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-amber-400 h-full"
                        />
                        <div
                          style={{
                            width: `${
                              totals.totalRegistered > 0
                                ? (totals.totalRejected / totals.totalRegistered) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-rose-500 h-full"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right text-brand-300 font-black">
                      100.0%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Report Footer / Notes */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                <strong>Trained Metric</strong> includes all candidates with status Approved, In Training, and Completed.
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Report generated on {new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-2.5 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
