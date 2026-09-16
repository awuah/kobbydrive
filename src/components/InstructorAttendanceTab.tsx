"use client";

import React, { useState } from "react";
import { InstructorAttendance } from "@/lib/operations-types";

export default function InstructorAttendanceTab() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const [instructors, setInstructors] = useState<InstructorAttendance[]>([
    {
      id: "inst_1",
      date: selectedDate,
      instructorName: "Emmanuel Mensah",
      shift: "Early morning 6am to 10am",
      assignedVehicle: "WR 4821-26 (Manual Hatchback)",
      status: "present",
      notes: "On time at Takoradi Jubilee Grounds",
      created_at: new Date().toISOString(),
    },
    {
      id: "inst_2",
      date: selectedDate,
      instructorName: "Francis Cudjoe",
      shift: "Mid morning 10am to 2pm",
      assignedVehicle: "WR 1092-26 (Manual Sedan)",
      status: "present",
      notes: "Conducting yard and parking maneuvers",
      created_at: new Date().toISOString(),
    },
    {
      id: "inst_3",
      date: selectedDate,
      instructorName: "Kofi Owusu",
      shift: "Late afternoon 2pm to 6pm",
      assignedVehicle: "WR 8831-26 (Automatic Sedan)",
      status: "present",
      notes: "Road driving and traffic navigation",
      created_at: new Date().toISOString(),
    },
  ]);

  const toggleStatus = (id: string, newStatus: "present" | "absent" | "half_day") => {
    setInstructors((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs h-full flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span>👨‍🏫 Instructor Daily Roster & Fleet Assignment</span>
          </h3>
          <p className="text-xs text-slate-500">
            Field check-ins and vehicle assignments for driving trainers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {instructors.map((inst) => (
          <div key={inst.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-3 rounded-xl transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">{inst.instructorName}</span>
                <span className={"px-2 py-0.5 rounded-full text-[10px] font-bold " +
                  (inst.status === "present" ? "bg-emerald-100 text-emerald-800" :
                   inst.status === "half_day" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800")
                }>
                  {inst.status === "present" ? "🟢 On Field" : inst.status === "half_day" ? "🟡 Half Day" : "🔴 Absent"}
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                <span>🕒 {inst.shift}</span>
                <span>•</span>
                <span>🚘 {inst.assignedVehicle}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">📍 {inst.notes}</p>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                onClick={() => toggleStatus(inst.id, "present")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                  (inst.status === "present" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600")
                }
              >
                Present
              </button>
              <button
                onClick={() => toggleStatus(inst.id, "half_day")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                  (inst.status === "half_day" ? "bg-amber-500 text-slate-950" : "bg-slate-100 text-slate-600")
                }
              >
                Half Day
              </button>
              <button
                onClick={() => toggleStatus(inst.id, "absent")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                  (inst.status === "absent" ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600")
                }
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
