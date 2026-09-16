"use client";

import React, { useState } from "react";
import { Application } from "@/lib/types";
import { formatApplicationStatus } from "@/lib/utils";

interface ScheduleApplicantListModalProps {
  scheduleTitle: string;
  scheduleTime: string;
  startDate: string;
  isActive: boolean;
  applicants: Application[];
  onClose: () => void;
  onUpdateApplicantSchedule: (applicantId: string, newSchedule: string) => Promise<void>;
  onUpdateApplicantStatus: (applicantId: string, newStatus: any) => Promise<void>;
}

export default function ScheduleApplicantListModal({
  scheduleTitle,
  scheduleTime,
  startDate,
  isActive,
  applicants,
  onClose,
  onUpdateApplicantSchedule,
  onUpdateApplicantStatus,
}: ScheduleApplicantListModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [electoralFilter, setElectoralFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredApplicants = applicants.filter((app) => {
    const fullName = (app.surname + " " + app.last_name).toLowerCase();
    const phone = (app.phone_number || "").toLowerCase();
    const ref = (app.application_number || "").toLowerCase();
    const s = searchTerm.toLowerCase();

    if (s && !fullName.includes(s) && !phone.includes(s) && !ref.includes(s)) {
      return false;
    }

    if (electoralFilter !== "all" && app.electoral_area !== electoralFilter) {
      return false;
    }

    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Tablet Friendly */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={"px-2.5 py-0.5 rounded-full text-xs font-bold " +
                (isActive ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30")
              }>
                {isActive ? "🟢 Active Schedule" : "🟡 Scheduled"}
              </span>
              <span className="text-xs text-slate-400">📅 Starts: {startDate}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1 truncate">
              {scheduleTitle}
            </h2>
            <p className="text-xs text-slate-400">{scheduleTime} • Total: {applicants.length} Applicant{applicants.length === 1 ? "" : "s"}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              🖨️ <span>Print Attendance</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <input
            type="text"
            placeholder="🔍 Search student name, phone or ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />

          <select
            value={electoralFilter}
            onChange={(e) => setElectoralFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          >
            <option value="all">All Electoral Areas ({filteredApplicants.length})</option>
            <option value="Airforce ( Airforce, adakope, kokompe & princess)">Airforce (Adakope, Kokompe & Princess)</option>
            <option value="Beach Road">Beach Road</option>
            <option value="Chapel Hill">Chapel Hill</option>
            <option value="Collins Avenue">Collins Avenue</option>
            <option value="Effakuma New Site">Effakuma New Site</option>
            <option value="Effakuma Old Site">Effakuma Old Site</option>
            <option value="Kwesimintsim">Kwesimintsim</option>
            <option value="Market Circle">Market Circle</option>
            <option value="New Takoradi">New Takoradi</option>
            <option value="Tanokrom">Tanokrom</option>
            <option value="Windy Ridge">Windy Ridge</option>
          </select>
        </div>

        {/* Applicant Card List - Tablet Optimized */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100">
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No applicants found in this schedule.
            </div>
          ) : (
            filteredApplicants.map((app, index) => {
              const statusInfo = formatApplicationStatus(app.status);

              return (
                <div
                  key={app.id}
                  className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {app.surname} {app.last_name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {app.application_number}
                        </span>
                        <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold border " + statusInfo.badgeClass}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                        <a
                          href={"tel:" + app.phone_number}
                          className="text-sky-700 font-semibold hover:underline flex items-center gap-1"
                        >
                          📞 {app.phone_number}
                        </a>
                        {app.electoral_area && (
                          <span className="text-slate-500">📍 {app.electoral_area}</span>
                        )}
                        {app.id_number && (
                          <span className="text-slate-400 font-mono text-[11px]">ID: {app.id_number}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Change Shift or Status */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <select
                      value={app.training_schedule || "unscheduled"}
                      disabled={updatingId === app.id}
                      onChange={async (e) => {
                        setUpdatingId(app.id);
                        await onUpdateApplicantSchedule(app.id, e.target.value);
                        setUpdatingId(null);
                      }}
                      className="text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 shadow-xs focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="Early morning 6am to 10am">🌅 Early (6am - 10am)</option>
                      <option value="Mid morning 10am to 2pm">☀️ Mid (10am - 2pm)</option>
                      <option value="Late afternoon 2pm to 6pm">🌇 Late (2pm - 6pm)</option>
                      <option value="unscheduled">⏳ Unscheduled</option>
                    </select>

                    <button
                      onClick={async () => {
                        setUpdatingId(app.id);
                        const nextStatus = app.status === "in_training" ? "completed" : "in_training";
                        await onUpdateApplicantStatus(app.id, nextStatus);
                        setUpdatingId(null);
                      }}
                      disabled={updatingId === app.id}
                      className={"px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs " +
                        (app.status === "in_training"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                          : "bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300")
                      }
                    >
                      {app.status === "in_training" ? "✓ Mark Complete" : "Set In Training"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredApplicants.length} of {applicants.length} student(s)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
