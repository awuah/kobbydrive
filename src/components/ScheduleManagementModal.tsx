"use client";

import React, { useState, useEffect } from "react";
import { Application } from "@/lib/types";
import ScheduleApplicantListModal from "./ScheduleApplicantListModal";

interface ScheduleManagementModalProps {
  onClose: () => void;
  adminPasscode: string;
}

interface ScheduleCardData {
  id: string;
  title: string;
  timeRange: string;
  icon: string;
  startDate: string;
  status: "active" | "upcoming" | "inactive";
  colorClass: string;
  bgLight: string;
  borderClass: string;
  filterKey: string;
}

export default function ScheduleManagementModal({
  onClose,
  adminPasscode,
}: ScheduleManagementModalProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<ScheduleCardData | null>(null);

  const scheduleCards: ScheduleCardData[] = [
    {
      id: "early",
      title: "Early Morning Schedule",
      timeRange: "6:00 AM – 10:00 AM",
      icon: "🌅",
      startDate: "Oct 2026",
      status: "active",
      colorClass: "text-amber-900",
      bgLight: "bg-gradient-to-br from-amber-50 to-orange-50/40",
      borderClass: "border-amber-200 hover:border-amber-400 hover:shadow-amber-100",
      filterKey: "early",
    },
    {
      id: "mid",
      title: "Mid Morning Schedule",
      timeRange: "10:00 AM – 2:00 PM",
      icon: "☀️",
      startDate: "Oct 2026",
      status: "active",
      colorClass: "text-sky-900",
      bgLight: "bg-gradient-to-br from-sky-50 to-blue-50/40",
      borderClass: "border-sky-200 hover:border-sky-400 hover:shadow-sky-100",
      filterKey: "mid",
    },
    {
      id: "late",
      title: "Late Afternoon Schedule",
      timeRange: "2:00 PM – 6:00 PM",
      icon: "🌇",
      startDate: "Oct 2026",
      status: "active",
      colorClass: "text-purple-900",
      bgLight: "bg-gradient-to-br from-purple-50 to-indigo-50/40",
      borderClass: "border-purple-200 hover:border-purple-400 hover:shadow-purple-100",
      filterKey: "late",
    },
    {
      id: "unscheduled",
      title: "Unscheduled Approved Pool",
      timeRange: "Pending Time Slot Assignment",
      icon: "⏳",
      startDate: "Awaiting Allocation",
      status: "upcoming",
      colorClass: "text-slate-800",
      bgLight: "bg-gradient-to-br from-slate-50 to-slate-100/50",
      borderClass: "border-slate-300 hover:border-slate-400 hover:shadow-slate-100",
      filterKey: "unscheduled",
    },
  ];

  // Load all approved & in-training applications
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin?status=all&limit=all", {
        headers: { Authorization: "Bearer " + adminPasscode },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const approvedAndTraining = data.data.filter(
          (a: Application) => a.status === "approved" || a.status === "in_training"
        );
        setApplications(approvedAndTraining);
      }
    } catch (err) {
      console.error("Failed to fetch schedule data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter applicants for a given card
  const getApplicantsForCard = (card: ScheduleCardData): Application[] => {
    return applications.filter((app) => {
      const s = (app.training_schedule || "unscheduled").toLowerCase();
      if (card.filterKey === "unscheduled") {
        return !s || s === "unscheduled";
      }
      if (card.filterKey === "early") {
        return s.includes("early") || s.includes("6am");
      }
      if (card.filterKey === "mid") {
        return s.includes("mid") || s.includes("10am");
      }
      if (card.filterKey === "late") {
        return s.includes("late") || s.includes("afternoon") || s.includes("2pm");
      }
      return false;
    });
  };

  const handleUpdateApplicantSchedule = async (applicantId: string, newSchedule: string) => {
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + adminPasscode,
        },
        body: JSON.stringify({
          batchIds: [applicantId],
          training_schedule: newSchedule,
        }),
      });
      await loadData();
    } catch (err) {
      console.error("Error updating schedule:", err);
    }
  };

  const handleUpdateApplicantStatus = async (applicantId: string, newStatus: string) => {
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + adminPasscode,
        },
        body: JSON.stringify({
          id: applicantId,
          status: newStatus,
        }),
      });
      await loadData();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Simple & Clean */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/20">
              📅
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Training Schedule Manager</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Tablet & Field View
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Tap any schedule card to inspect student names, contact info, and take attendance.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main Body - Simple Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>Loading schedule counts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {scheduleCards.map((card) => {
                const cardApps = getApplicantsForCard(card);
                const count = cardApps.length;
                const inTrainingCount = cardApps.filter((a) => a.status === "in_training").length;

                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={"p-5 sm:p-6 rounded-2xl border-2 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.99] " +
                      card.bgLight + " " + card.borderClass
                    }
                  >
                    <div>
                      {/* Card Header & Status Badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{card.icon}</span>
                          <div>
                            <h3 className={"font-black text-base sm:text-lg " + card.colorClass}>
                              {card.title}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500">
                              🕒 {card.timeRange}
                            </p>
                          </div>
                        </div>

                        <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border " +
                          (card.status === "active"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-amber-100 text-amber-800 border-amber-300")
                        }>
                          {card.status === "active" ? "🟢 Active" : "🟡 Pending"}
                        </span>
                      </div>

                      {/* Start Date & In Training Stats */}
                      <div className="flex items-center justify-between text-xs text-slate-600 my-4 bg-white/70 p-3 rounded-xl border border-slate-200/60">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Start Date</span>
                          <span className="font-bold text-slate-800">📅 {card.startDate}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">In Training</span>
                          <span className="font-bold text-purple-700">🚘 {inTrainingCount} Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Count & Action Button */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {count}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold ml-1.5">
                          Applicants Enrolled
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all">
                        <span>Open Roster</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Card Applicant List Modal */}
        {selectedCard && (
          <ScheduleApplicantListModal
            scheduleTitle={selectedCard.title}
            scheduleTime={selectedCard.timeRange}
            startDate={selectedCard.startDate}
            isActive={selectedCard.status === "active"}
            applicants={getApplicantsForCard(selectedCard)}
            onClose={() => setSelectedCard(null)}
            onUpdateApplicantSchedule={handleUpdateApplicantSchedule}
            onUpdateApplicantStatus={handleUpdateApplicantStatus}
          />
        )}
      </div>
    </div>
  );
}
