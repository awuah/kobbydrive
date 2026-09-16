"use client";

import React, { useState } from "react";
import { Application, TrainingCohort } from "@/lib/types";
import { formatTrainingScheduleBadge } from "@/lib/utils";

interface ApplicantAssignmentPoolProps {
  applicants: Application[];
  cohorts: TrainingCohort[];
  onAssignApplicants: (applicantIds: string[], cohortId: string, slotLabel: string, cohortName: string) => Promise<void>;
  isAssigning: boolean;
}

export default function ApplicantAssignmentPool({
  applicants,
  cohorts,
  onAssignApplicants,
  isAssigning,
}: ApplicantAssignmentPoolProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [electoralFilter, setElectoralFilter] = useState("all");
  const [scheduleFilter, setScheduleFilter] = useState("all");

  const [targetCohortId, setTargetCohortId] = useState(cohorts[0]?.id || "");
  const [targetSlot, setTargetSlot] = useState<string>("Early morning 6am to 10am");

  const targetCohort = cohorts.find((c) => c.id === targetCohortId) || cohorts[0];

  // Filtering
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

    if (scheduleFilter !== "all") {
      const appSched = (app.training_schedule || "unscheduled").toLowerCase();
      if (scheduleFilter === "unscheduled" && appSched !== "unscheduled") return false;
      if (scheduleFilter !== "unscheduled" && !appSched.includes(scheduleFilter.toLowerCase())) return false;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplicants.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = async () => {
    if (!targetCohort || selectedIds.length === 0) return;
    await onAssignApplicants(selectedIds, targetCohort.id, targetSlot, targetCohort.name);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Approved Applicant Pool</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-black">
                {filteredApplicants.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Drag applicant or select multiple to batch-assign into a 3-week cohort
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <input
            type="text"
            placeholder="🔍 Search name, phone, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />

          <select
            value={scheduleFilter}
            onChange={(e) => setScheduleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="all">All Preferred Shifts</option>
            <option value="unscheduled">⏳ Unscheduled</option>
            <option value="early">🌅 Early Morning (6am–10am)</option>
            <option value="mid">☀️ Mid Morning (10am–2pm)</option>
            <option value="late">🌇 Late Afternoon (2pm–6pm)</option>
          </select>

          <select
            value={electoralFilter}
            onChange={(e) => setElectoralFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="all">All Electoral Areas</option>
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

        {/* Batch Assign Bar */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
            <span className="text-xs font-bold text-amber-900">
              ⚡ {selectedIds.length} candidate{selectedIds.length > 1 ? "s" : ""} selected
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={targetCohortId}
                onChange={(e) => setTargetCohortId(e.target.value)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-amber-300 bg-white text-slate-800"
              >
                {cohorts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.totalEnrolled}/90)
                  </option>
                ))}
              </select>

              <select
                value={targetSlot}
                onChange={(e) => setTargetSlot(e.target.value)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-amber-300 bg-white text-slate-800"
              >
                <option value="Early morning 6am to 10am">🌅 Early Morning (6am–10am)</option>
                <option value="Mid morning 10am to 2pm">☀️ Mid Morning (10am–2pm)</option>
                <option value="Late afternoon 2pm to 6pm">🌇 Late Afternoon (2pm–6pm)</option>
              </select>

              <button
                onClick={handleBulkAssign}
                disabled={isAssigning}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95"
              >
                {isAssigning ? "Assigning..." : "Assign to Cohort"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Applicant Card List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredApplicants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No applicants match the selected criteria.
          </div>
        ) : (
          filteredApplicants.map((app) => {
            const isSelected = selectedIds.includes(app.id);
            const schedBadge = formatTrainingScheduleBadge(app.training_schedule);

            return (
              <div
                key={app.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/applicant-id", app.id);
                }}
                className={"p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing " +
                  (isSelected
                    ? "bg-amber-50/60 border-amber-400 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs")
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(app.id)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {app.surname} {app.last_name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {app.application_number}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-2">
                      <span>📞 {app.phone_number}</span>
                      {app.electoral_area && (
                        <span>📍 {app.electoral_area}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${schedBadge.badgeClass}`}>
                    {schedBadge.label}
                  </span>
                  <span className="text-slate-300 text-xs cursor-grab">⋮⋮</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Select All Bar */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
        <button
          onClick={toggleSelectAll}
          className="font-semibold text-sky-700 hover:underline"
        >
          {selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0
            ? "Deselect All"
            : "Select All (" + filteredApplicants.length + ")"}
        </button>
        <span className="text-[11px] text-slate-400">
          Showing {filteredApplicants.length} candidate(s)
        </span>
      </div>
    </div>
  );
}
