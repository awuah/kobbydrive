"use client";

import React, { useState } from "react";
import { TrainingCohort, Application } from "@/lib/types";
import { MAX_COHORT_CAPACITY, MAX_SLOT_CAPACITY, getCapacityBadge } from "@/lib/schedule-manager";

interface CohortDetailModalProps {
  cohort: TrainingCohort;
  enrolledApplicants: Application[];
  onClose: () => void;
  onUnassignApplicant: (applicantId: string) => Promise<void>;
  onMoveShift: (applicantId: string, targetSlotLabel: string) => Promise<void>;
}

export default function CohortDetailModal({
  cohort,
  enrolledApplicants,
  onClose,
  onUnassignApplicant,
  onMoveShift,
}: CohortDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "early" | "mid" | "late">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const capInfo = getCapacityBadge(enrolledApplicants.length, MAX_COHORT_CAPACITY);

  const filterApplicants = (slotFilter?: "early" | "mid" | "late") => {
    return enrolledApplicants.filter((app) => {
      const fullName = (app.surname + " " + app.last_name).toLowerCase();
      const phone = (app.phone_number || "").toLowerCase();
      const ref = (app.application_number || "").toLowerCase();
      const s = searchTerm.toLowerCase();

      if (s && !fullName.includes(s) && !phone.includes(s) && !ref.includes(s)) {
        return false;
      }

      if (!slotFilter) return true;

      const sched = (app.training_schedule || "").toLowerCase();
      if (slotFilter === "early" && (sched.includes("early") || sched.includes("6am"))) return true;
      if (slotFilter === "mid" && (sched.includes("mid") || sched.includes("10am"))) return true;
      if (slotFilter === "late" && (sched.includes("late") || sched.includes("2pm") || sched.includes("afternoon"))) return true;

      return false;
    });
  };

  const earlyApps = filterApplicants("early");
  const midApps = filterApplicants("mid");
  const lateApps = filterApplicants("late");
  const displayedApps = activeTab === "all" ? filterApplicants() : filterApplicants(activeTab);

  const handlePrintAttendanceSheet = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ["Index", "Ref", "Full Name", "Gender", "Phone Number", "ID Number", "Electoral Area", "Time Slot"];
    const rows = displayedApps.map((a, i) => [
      i + 1,
      a.application_number,
      '"' + a.surname + " " + a.last_name + '"',
      a.gender,
      '"' + a.phone_number + '"',
      '"' + a.id_number + '"',
      '"' + (a.electoral_area || "") + '"',
      '"' + (a.training_schedule || "") + '"',
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", cohort.code + "_Class_Roster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs">
                {cohort.code}
              </span>
              <h2 className="text-lg font-bold">{cohort.name}</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
              <span>📅 Duration: {cohort.startDate} to {cohort.endDate} (3 Weeks, Mon–Sat)</span>
              <span>•</span>
              <span>👥 Max Capacity: 90 Applicants (30 per Shift)</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white border border-slate-600 transition-colors"
            >
              📥 CSV Export
            </button>
            <button
              onClick={handlePrintAttendanceSheet}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-colors"
            >
              🖨️ Print Attendance Sheet
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Capacity Summary Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Total Enrolled</div>
            <div className="text-xl font-extrabold text-slate-900">
              {enrolledApplicants.length} <span className="text-xs text-slate-400">/ 90</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={"h-full rounded-full " + capInfo.progressColor}
                style={{ width: capInfo.percentage + "%" }}
              />
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-sky-700 font-semibold">🌅 Early (6am–10am)</div>
            <div className="text-xl font-extrabold text-sky-900">
              {earlyApps.length} <span className="text-xs text-slate-400">/ 30</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">{30 - earlyApps.length} slots left</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-amber-700 font-semibold">☀️ Mid (10am–2pm)</div>
            <div className="text-xl font-extrabold text-amber-900">
              {midApps.length} <span className="text-xs text-slate-400">/ 30</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">{30 - midApps.length} slots left</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-purple-700 font-semibold">🌇 Late (2pm–6pm)</div>
            <div className="text-xl font-extrabold text-purple-900">
              {lateApps.length} <span className="text-xs text-slate-400">/ 30</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">{30 - lateApps.length} slots left</div>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                (activeTab === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900")
              }
            >
              All Shifts ({enrolledApplicants.length})
            </button>
            <button
              onClick={() => setActiveTab("early")}
              className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                (activeTab === "early" ? "bg-white text-sky-800 shadow-xs" : "text-slate-600 hover:text-slate-900")
              }
            >
              🌅 Early Morning ({earlyApps.length}/30)
            </button>
            <button
              onClick={() => setActiveTab("mid")}
              className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                (activeTab === "mid" ? "bg-white text-amber-800 shadow-xs" : "text-slate-600 hover:text-slate-900")
              }
            >
              ☀️ Mid Morning ({midApps.length}/30)
            </button>
            <button
              onClick={() => setActiveTab("late")}
              className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                (activeTab === "late" ? "bg-white text-purple-800 shadow-xs" : "text-slate-600 hover:text-slate-900")
              }
            >
              🌇 Late Afternoon ({lateApps.length}/30)
            </button>
          </div>

          <input
            type="text"
            placeholder="🔍 Search enrolled students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-64"
          />
        </div>

        {/* Table of Enrolled Candidates */}
        <div className="flex-1 overflow-y-auto p-4">
          {displayedApps.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No students enrolled in this view.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3">Ref & Candidate</th>
                    <th className="p-3">Phone & Electoral Area</th>
                    <th className="p-3">Assigned Shift</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedApps.map((app, idx) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{app.surname} {app.last_name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{app.application_number}</div>
                      </td>
                      <td className="p-3">
                        <div>📞 {app.phone_number}</div>
                        <div className="text-[11px] text-slate-500">📍 {app.electoral_area || "N/A"}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-sky-50 text-sky-800 border border-sky-200">
                          {app.training_schedule || "Assigned"}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => onUnassignApplicant(app.id)}
                          className="px-2 py-1 rounded text-[11px] font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                          title="Remove candidate from this cohort"
                        >
                          Unassign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
