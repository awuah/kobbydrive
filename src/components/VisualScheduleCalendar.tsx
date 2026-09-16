"use client";

import React, { useState } from "react";
import {
  TrainingCohort,
  Application
} from "@/lib/types";
import {
  MAX_COHORT_CAPACITY,
  MAX_SLOT_CAPACITY,
  getCapacityBadge,
  calculate3WeekCohortDates
} from "@/lib/schedule-manager";

interface VisualScheduleCalendarProps {
  cohorts: TrainingCohort[];
  applications: Application[];
  onSelectCohort: (cohort: TrainingCohort) => void;
  onDropApplicantToCohort?: (applicantId: string, cohortId: string, slotId: "early" | "mid" | "late") => void;
  onRescheduleCohort?: (cohortId: string, newStartDate: string) => void;
  onCreateCohort?: () => void;
}

export default function VisualScheduleCalendar({
  cohorts,
  applications,
  onSelectCohort,
  onDropApplicantToCohort,
  onRescheduleCohort,
  onCreateCohort,
}: VisualScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedApplicantId, setDraggedApplicantId] = useState<string | null>(null);
  const [draggedCohortId, setDraggedCohortId] = useState<string | null>(null);

  // Month navigation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar grid calculation (starting on Monday)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 0 is Sun, 1 is Mon, ... 6 is Sat. We want Mon (0) to Sun (6)
  let startOffset = firstDayOfMonth.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const totalDays = lastDayOfMonth.getDate();
  const calendarCells: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isMonday: boolean; isSunday: boolean }[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, d);
    calendarCells.push({
      dateStr: prevDate.toISOString().split("T")[0],
      dayNum: d,
      isCurrentMonth: false,
      isMonday: prevDate.getDay() === 1,
      isSunday: prevDate.getDay() === 0,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(year, month, d);
    calendarCells.push({
      dateStr: curDate.toISOString().split("T")[0],
      dayNum: d,
      isCurrentMonth: true,
      isMonday: curDate.getDay() === 1,
      isSunday: curDate.getDay() === 0,
    });
  }

  // Next month padding to fill complete weeks (up to multiple of 7)
  const remaining = 7 - (calendarCells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      calendarCells.push({
        dateStr: nextDate.toISOString().split("T")[0],
        dayNum: d,
        isCurrentMonth: false,
        isMonday: nextDate.getDay() === 1,
        isSunday: nextDate.getDay() === 0,
      });
    }
  }

  const todayStr = new Date().toISOString().split("T")[0];

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnDate = (e: React.DragEvent, targetDateStr: string, isMonday: boolean) => {
    e.preventDefault();
    const cohortId = e.dataTransfer.getData("text/cohort-id");
    if (cohortId && onRescheduleCohort) {
      // Recalculate to nearest Monday
      const { startDate } = calculate3WeekCohortDates(targetDateStr);
      onRescheduleCohort(cohortId, startDate);
    }
  };

  const handleDropApplicantOnCohortSlot = (
    e: React.DragEvent,
    cohortId: string,
    slotId: "early" | "mid" | "late"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const applicantId = e.dataTransfer.getData("text/applicant-id");
    if (applicantId && onDropApplicantToCohort) {
      onDropApplicantToCohort(applicantId, cohortId, slotId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 font-black">
            📅
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{monthNames[month]} {year}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold border border-sky-200">
                3-Week Mon–Sat Cycles
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Drag cohorts to reschedule start dates, or click any cohort to manage class rosters (Max 90 per cohort)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-md transition-colors"
              title="Previous Month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-md transition-colors"
              title="Next Month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {onCreateCohort && (
            <button
              onClick={onCreateCohort}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add 3-Week Cohort</span>
            </button>
          )}
        </div>
      </div>

      {/* Weekday Column Headers (Mon to Sun) */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-600 text-center py-2.5">
        <div className="text-sky-700">Mon (Day 1)</div>
        <div>Tue (Day 2)</div>
        <div>Wed (Day 3)</div>
        <div>Thu (Day 4)</div>
        <div>Fri (Day 5)</div>
        <div className="text-amber-700">Sat (Day 6)</div>
        <div className="text-slate-400">Sun (Rest)</div>
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 auto-rows-fr flex-1 divide-x divide-y divide-slate-100 bg-slate-50/30 overflow-y-auto min-h-[520px]">
        {calendarCells.map((cell, idx) => {
          const isToday = cell.dateStr === todayStr;
          
          // Find cohorts starting or active on this day
          const startingCohorts = cohorts.filter((c) => c.startDate === cell.dateStr);
          const activeCohorts = cohorts.filter(
            (c) => c.startDate <= cell.dateStr && c.endDate >= cell.dateStr
          );

          return (
            <div
              key={idx}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnDate(e, cell.dateStr, cell.isMonday)}
              className={`min-h-[110px] p-1.5 transition-colors flex flex-col ${
                !cell.isCurrentMonth ? "bg-slate-50/70 opacity-50" : "bg-white"
              } ${cell.isSunday ? "bg-slate-100/40" : ""} ${
                isToday ? "ring-2 ring-inset ring-amber-400/80 bg-amber-50/20" : ""
              } hover:bg-slate-50/90`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-full ${
                    isToday
                      ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                      : cell.isMonday
                      ? "bg-sky-100 text-sky-800 font-bold"
                      : "text-slate-700"
                  }`}
                >
                  {cell.dayNum}
                </span>

                {cell.isMonday && cell.isCurrentMonth && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 bg-sky-50 px-1 rounded">
                    Start
                  </span>
                )}
              </div>

              {/* Cohort Cards Starting on This Day */}
              <div className="space-y-1.5 flex-1 flex flex-col">
                {startingCohorts.map((cohort) => {
                  const capInfo = getCapacityBadge(cohort.totalEnrolled, cohort.maxCapacity);
                  
                  return (
                    <div
                      key={cohort.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/cohort-id", cohort.id);
                        setDraggedCohortId(cohort.id);
                      }}
                      onDragEnd={() => setDraggedCohortId(null)}
                      onClick={() => onSelectCohort(cohort)}
                      className={`cursor-pointer group relative p-2 rounded-xl border border-slate-300 shadow-sm transition-all hover:shadow-md hover:border-amber-400 bg-gradient-to-br from-white via-amber-50/30 to-amber-100/40 ${
                        draggedCohortId === cohort.id ? "opacity-40 ring-2 ring-amber-500" : ""
                      }`}
                    >
                      {/* Cohort Title & Drag Grip */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="font-extrabold text-xs text-slate-900 line-clamp-1 group-hover:text-amber-700">
                          {cohort.name}
                        </div>
                        <span className="text-slate-400 group-hover:text-slate-600 text-[10px] cursor-grab">
                          ⋮⋮
                        </span>
                      </div>

                      {/* 3-Week Duration Badge */}
                      <div className="text-[10px] text-slate-500 mb-1.5 flex items-center gap-1 font-medium">
                        <span>⏳ 3 Wks (Mon–Sat)</span>
                      </div>

                      {/* Capacity Meter (Max 90) */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-700">
                            {cohort.totalEnrolled} / {cohort.maxCapacity} Seats
                          </span>
                          <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] border ${capInfo.badgeClass}`}>
                            {capInfo.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${capInfo.progressColor}`}
                            style={{ width: `${capInfo.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Shift Drop Targets */}
                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 grid grid-cols-3 gap-1 text-center text-[9px] font-bold">
                        <div
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropApplicantOnCohortSlot(e, cohort.id, "early")}
                          className="bg-sky-50 hover:bg-sky-100 text-sky-800 p-1 rounded border border-sky-200 transition-colors"
                          title="Early Morning (6am–10am): Max 30"
                        >
                          🌅 {cohort.slots.early.enrolledCount}/30
                        </div>
                        <div
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropApplicantOnCohortSlot(e, cohort.id, "mid")}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 p-1 rounded border border-amber-200 transition-colors"
                          title="Mid Morning (10am–2pm): Max 30"
                        >
                          ☀️ {cohort.slots.mid.enrolledCount}/30
                        </div>
                        <div
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropApplicantOnCohortSlot(e, cohort.id, "late")}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-800 p-1 rounded border border-purple-200 transition-colors"
                          title="Late Afternoon (2pm–6pm): Max 30"
                        >
                          🌇 {cohort.slots.late.enrolledCount}/30
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Indicators for active ongoing weeks */}
                {startingCohorts.length === 0 && activeCohorts.length > 0 && cell.isCurrentMonth && !cell.isSunday && (
                  <div className="mt-auto pt-1">
                    {activeCohorts.slice(0, 2).map((c) => (
                      <div
                        key={c.id}
                        onClick={() => onSelectCohort(c)}
                        className="text-[9px] truncate px-1 py-0.5 rounded bg-slate-100 hover:bg-amber-100 text-slate-700 cursor-pointer border border-slate-200 font-medium mb-0.5 transition-colors"
                      >
                        🔹 {c.code} ({c.totalEnrolled}/90)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
