"use client";

import React, { useState } from "react";
import { Application } from "@/lib/types";
import { AttendanceStatus } from "@/lib/operations-types";

interface TraineeAttendanceTabProps {
  candidates: Application[];
  adminPasscode: string;
}

export default function TraineeAttendanceTab({
  candidates,
  adminPasscode,
}: TraineeAttendanceTabProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedShift, setSelectedShift] = useState<string>("all");
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const fullName = (c.surname + " " + c.last_name).toLowerCase();
    const phone = (c.phone_number || "").toLowerCase();
    const ref = (c.application_number || "").toLowerCase();
    const s = searchTerm.toLowerCase();

    if (s && !fullName.includes(s) && !phone.includes(s) && !ref.includes(s)) {
      return false;
    }

    if (selectedShift !== "all") {
      const sched = (c.training_schedule || "unscheduled").toLowerCase();
      if (!sched.includes(selectedShift.toLowerCase())) return false;
    }

    return true;
  });

  const handleSetStatus = (id: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: status }));
  };

  const markAllPresent = () => {
    const next: Record<string, AttendanceStatus> = { ...attendanceMap };
    filteredCandidates.forEach((c) => {
      next[c.id] = "present";
    });
    setAttendanceMap(next);
  };

  const presentCount = filteredCandidates.filter(
    (c) => (attendanceMap[c.id] || "present") === "present"
  ).length;
  const lateCount = filteredCandidates.filter(
    (c) => attendanceMap[c.id] === "late"
  ).length;
  const absentCount = filteredCandidates.filter(
    (c) => attendanceMap[c.id] === "absent"
  ).length;
  const excusedCount = filteredCandidates.filter(
    (c) => attendanceMap[c.id] === "excused"
  ).length;

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + adminPasscode,
        },
        body: JSON.stringify({
          action: "RECORD_ATTENDANCE",
          payload: {
            date: selectedDate,
            shift: selectedShift,
            count: filteredCandidates.length,
          },
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Filter & Quick Actions Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Roll-Call Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Training Shift
            </label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Daily Shifts</option>
              <option value="early">🌅 Early Morning (6am - 10am)</option>
              <option value="mid">☀️ Mid Morning (10am - 2pm)</option>
              <option value="late">🌇 Late Afternoon (2pm - 6pm)</option>
            </select>
          </div>

          <div className="w-48">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Search Student
            </label>
            <input
              type="text"
              placeholder="Name or ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllPresent}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition-all active:scale-95"
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : saveSuccess ? "✓ Saved!" : "💾 Save Attendance"}
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-xs text-emerald-800 font-bold block">Present</span>
          <span className="text-xl font-black text-emerald-900">{presentCount}</span>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-xs text-amber-800 font-bold block">Late</span>
          <span className="text-xl font-black text-amber-900">{lateCount}</span>
        </div>
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <span className="text-xs text-rose-800 font-bold block">Absent</span>
          <span className="text-xl font-black text-rose-900">{absentCount}</span>
        </div>
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
          <span className="text-xs text-sky-800 font-bold block">Excused</span>
          <span className="text-xl font-black text-sky-900">{excusedCount}</span>
        </div>
      </div>

      {/* Trainees Attendance Table */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 p-2 sm:p-3">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No trainees found for this shift and filter.
            </div>
          ) : (
            filteredCandidates.map((cand, idx) => {
              const currentStatus: AttendanceStatus = attendanceMap[cand.id] || "present";

              return (
                <div
                  key={cand.id}
                  className="py-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {cand.surname} {cand.last_name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-slate-400">{cand.application_number}</span>
                        <span>•</span>
                        <a href={"tel:" + cand.phone_number} className="text-sky-700 font-semibold hover:underline">
                          📞 {cand.phone_number}
                        </a>
                        {cand.electoral_area && <span>• 📍 {cand.electoral_area}</span>}
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Attendance Buttons for Tablets */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleSetStatus(cand.id, "present")}
                      className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                        (currentStatus === "present"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-emerald-50")
                      }
                    >
                      ✓ Present
                    </button>
                    <button
                      onClick={() => handleSetStatus(cand.id, "late")}
                      className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                        (currentStatus === "late"
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-amber-50")
                      }
                    >
                      ⏰ Late
                    </button>
                    <button
                      onClick={() => handleSetStatus(cand.id, "absent")}
                      className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                        (currentStatus === "absent"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-rose-50")
                      }
                    >
                      ✕ Absent
                    </button>
                    <button
                      onClick={() => handleSetStatus(cand.id, "excused")}
                      className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                        (currentStatus === "excused"
                          ? "bg-sky-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-sky-50")
                      }
                    >
                      📝 Excused
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
