"use client";

import React, { useState, useEffect } from "react";
import { InstructorAttendance } from "@/lib/operations-types";

interface InstructorItem {
  id: string;
  name: string;
  phone: string;
  shift: string;
  assignedVehicle: string;
  status: "present" | "absent" | "half_day";
  notes?: string;
  created_at: string;
}

const DEFAULT_INSTRUCTORS: InstructorItem[] = [
  {
    id: "inst_1",
    name: "Emmanuel Mensah",
    phone: "024 456 7890",
    shift: "Early morning 6am to 10am",
    assignedVehicle: "WR 4821-26 (Manual Hatchback)",
    status: "present",
    notes: "Takoradi Jubilee Grounds",
    created_at: new Date().toISOString(),
  },
  {
    id: "inst_2",
    name: "Francis Cudjoe",
    phone: "020 987 6543",
    shift: "Mid morning 10am to 2pm",
    assignedVehicle: "WR 1092-26 (Manual Sedan)",
    status: "present",
    notes: "Conducting yard and parking maneuvers",
    created_at: new Date().toISOString(),
  },
  {
    id: "inst_3",
    name: "Kofi Owusu",
    phone: "055 123 4567",
    shift: "Late afternoon 2pm to 6pm",
    assignedVehicle: "WR 8831-26 (Automatic Sedan)",
    status: "present",
    notes: "Road driving and traffic navigation",
    created_at: new Date().toISOString(),
  },
];

export default function InstructorAttendanceTab() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<InstructorItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formShift, setFormShift] = useState("Early morning 6am to 10am");
  const [formVehicle, setFormVehicle] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Load from localStorage or defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kbdr_instructors_roster");
      if (saved) {
        try {
          setInstructors(JSON.parse(saved));
        } catch {
          setInstructors(DEFAULT_INSTRUCTORS);
        }
      } else {
        setInstructors(DEFAULT_INSTRUCTORS);
      }
    }
  }, []);

  const saveToStorage = (updated: InstructorItem[]) => {
    setInstructors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kbdr_instructors_roster", JSON.stringify(updated));
    }
  };

  const handleOpenAdd = () => {
    setEditingInstructor(null);
    setFormName("");
    setFormPhone("");
    setFormShift("Early morning 6am to 10am");
    setFormVehicle("WR 4821-26 (Manual)");
    setFormNotes("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (inst: InstructorItem) => {
    setEditingInstructor(inst);
    setFormName(inst.name);
    setFormPhone(inst.phone || "");
    setFormShift(inst.shift);
    setFormVehicle(inst.assignedVehicle || "");
    setFormNotes(inst.notes || "");
    setShowAddModal(true);
  };

  const handleSaveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingInstructor) {
      const updated = instructors.map((i) =>
        i.id === editingInstructor.id
          ? {
              ...i,
              name: formName.trim(),
              phone: formPhone.trim(),
              shift: formShift,
              assignedVehicle: formVehicle.trim(),
              notes: formNotes.trim(),
            }
          : i
      );
      saveToStorage(updated);
    } else {
      const newInst: InstructorItem = {
        id: "inst_" + Date.now(),
        name: formName.trim(),
        phone: formPhone.trim(),
        shift: formShift,
        assignedVehicle: formVehicle.trim() || "Unassigned",
        status: "present",
        notes: formNotes.trim(),
        created_at: new Date().toISOString(),
      };
      saveToStorage([...instructors, newInst]);
    }

    setShowAddModal(false);
  };

  const handleDeleteInstructor = (id: string) => {
    if (confirm("Are you sure you want to remove this instructor?")) {
      const updated = instructors.filter((i) => i.id !== id);
      saveToStorage(updated);
    }
  };

  const toggleStatus = (id: string, newStatus: "present" | "absent" | "half_day") => {
    const updated = instructors.map((i) =>
      i.id === id ? { ...i, status: newStatus } : i
    );
    saveToStorage(updated);
  };

  const onFieldCount = instructors.filter((i) => i.status === "present").length;
  const halfDayCount = instructors.filter((i) => i.status === "half_day").length;
  const absentCount = instructors.filter((i) => i.status === "absent").length;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs h-full flex flex-col space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span>👨‍🏫 Instructors & Trainers Management</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-black">
              {instructors.length} Instructors
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your team of driving instructors, vehicle assignments, and daily field attendance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300"
          />

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>➕</span>
            <span>Add Instructor</span>
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">On Field</span>
          <span className="text-xl font-black text-emerald-900">{onFieldCount} Active</span>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Half Day</span>
          <span className="text-xl font-black text-amber-900">{halfDayCount}</span>
        </div>
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-rose-800 block">Absent / Leave</span>
          <span className="text-xl font-black text-rose-900">{absentCount}</span>
        </div>
      </div>

      {/* Instructor Cards List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {instructors.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs">
            No instructors added yet. Click <strong>"Add Instructor"</strong> to register your team.
          </div>
        ) : (
          instructors.map((inst) => (
            <div
              key={inst.id}
              className="py-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-3 rounded-xl transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm text-slate-900">{inst.name}</span>
                  {inst.phone && (
                    <a href={"tel:" + inst.phone} className="text-xs font-semibold text-sky-700 hover:underline">
                      📞 {inst.phone}
                    </a>
                  )}
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
                  <span>🚘 {inst.assignedVehicle || "No vehicle assigned"}</span>
                </div>
                {inst.notes && (
                  <p className="text-[11px] text-slate-500 mt-0.5">📍 {inst.notes}</p>
                )}
              </div>

              {/* Action Buttons: Status Toggles, Edit, Delete */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => toggleStatus(inst.id, "present")}
                    className={"px-2.5 py-1 rounded-md text-xs font-bold transition-all " +
                      (inst.status === "present" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900")
                    }
                  >
                    Field
                  </button>
                  <button
                    onClick={() => toggleStatus(inst.id, "half_day")}
                    className={"px-2.5 py-1 rounded-md text-xs font-bold transition-all " +
                      (inst.status === "half_day" ? "bg-amber-500 text-slate-950 shadow-2xs" : "text-slate-600 hover:text-slate-900")
                    }
                  >
                    Half
                  </button>
                  <button
                    onClick={() => toggleStatus(inst.id, "absent")}
                    className={"px-2.5 py-1 rounded-md text-xs font-bold transition-all " +
                      (inst.status === "absent" ? "bg-rose-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900")
                    }
                  >
                    Off
                  </button>
                </div>

                <button
                  onClick={() => handleOpenEdit(inst)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Instructor Details"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDeleteInstructor(inst.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Instructor"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">
                {editingInstructor ? "✏️ Edit Instructor" : "➕ Add New Instructor"}
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInstructor} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emmanuel Mensah"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 024 123 4567"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Assigned Shift
                </label>
                <select
                  value={formShift}
                  onChange={(e) => setFormShift(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Early morning 6am to 10am">🌅 Early morning (6am - 10am)</option>
                  <option value="Mid morning 10am to 2pm">☀️ Mid morning (10am - 2pm)</option>
                  <option value="Late afternoon 2pm to 6pm">🌇 Late afternoon (2pm - 6pm)</option>
                  <option value="All Shifts / Lead Trainer">⭐ All Shifts / Lead Trainer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Assigned Vehicle
                </label>
                <input
                  type="text"
                  placeholder="e.g. WR 4821-26 (Manual Hatchback)"
                  value={formVehicle}
                  onChange={(e) => setFormVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Field Location / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Takoradi Jubilee Grounds"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  {editingInstructor ? "Save Changes" : "Add Instructor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
