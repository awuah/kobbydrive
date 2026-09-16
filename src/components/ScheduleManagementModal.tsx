"use client";

import React, { useState, useEffect } from "react";
import { TrainingCohort, Application } from "@/lib/types";
import { createDefaultCohort, calculate3WeekCohortDates } from "@/lib/schedule-manager";
import VisualScheduleCalendar from "./VisualScheduleCalendar";
import ApplicantAssignmentPool from "./ApplicantAssignmentPool";
import CohortDetailModal from "./CohortDetailModal";

interface ScheduleManagementModalProps {
  onClose: () => void;
  adminPasscode: string;
}

export default function ScheduleManagementModal({
  onClose,
  adminPasscode,
}: ScheduleManagementModalProps) {
  const [cohorts, setCohorts] = useState<TrainingCohort[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<Application[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<TrainingCohort | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [activeView, setActiveView] = useState<"calendar" | "pool">("calendar");

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/schedules", {
        headers: { "x-admin-passcode": adminPasscode },
      });
      const data = await res.json();
      if (data.success) {
        const apps: Application[] = data.applications || [];
        setApprovedApplications(apps);

        // Build initial cohorts starting next Monday
        setCohorts((prev) => {
          if (prev.length > 0) return prev;
          const c1 = createDefaultCohort(1, "2026-09-21");
          const c2 = createDefaultCohort(2, "2026-10-12");
          const c3 = createDefaultCohort(3, "2026-11-02");
          return [c1, c2, c3];
        });
      }
    } catch (err) {
      console.error("Failed to load schedules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update cohort counts based on application assignments
  const syncCohortsWithApplications = (currentCohorts: TrainingCohort[], apps: Application[]): TrainingCohort[] => {
    return currentCohorts.map((cohort) => {
      const cohortApps = apps.filter((a) => {
        const purpose = a.training_purpose || "";
        return purpose.includes(cohort.name) || purpose.includes(cohort.code);
      });

      const early = cohortApps.filter((a) => {
        const s = (a.training_schedule || a.training_purpose || "").toLowerCase();
        return s.includes("early") || s.includes("6am");
      });
      const mid = cohortApps.filter((a) => {
        const s = (a.training_schedule || a.training_purpose || "").toLowerCase();
        return s.includes("mid") || s.includes("10am");
      });
      const late = cohortApps.filter((a) => {
        const s = (a.training_schedule || a.training_purpose || "").toLowerCase();
        return s.includes("late") || s.includes("2pm") || s.includes("afternoon");
      });

      return {
        ...cohort,
        totalEnrolled: cohortApps.length,
        slots: {
          early: { ...cohort.slots.early, enrolledCount: early.length, applicantIds: early.map((a) => a.id) },
          mid: { ...cohort.slots.mid, enrolledCount: mid.length, applicantIds: mid.map((a) => a.id) },
          late: { ...cohort.slots.late, enrolledCount: late.length, applicantIds: late.map((a) => a.id) },
        },
      };
    });
  };

  const activeCohorts = syncCohortsWithApplications(cohorts, approvedApplications);

  // Unscheduled applications
  const unscheduledApps = approvedApplications.filter((a) => {
    const purpose = a.training_purpose || "";
    const isAssigned = activeCohorts.some((c) => purpose.includes(c.name) || purpose.includes(c.code));
    return !isAssigned;
  });

  // Actions
  const handleAssignApplicants = async (
    applicantIds: string[],
    cohortId: string,
    slotLabel: string,
    cohortName: string
  ) => {
    setIsAssigning(true);
    try {
      const res = await fetch("/api/admin/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": adminPasscode,
        },
        body: JSON.stringify({
          action: "ASSIGN_TO_COHORT",
          applicantIds,
          cohortId,
          cohortName,
          slotLabel,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await fetchData();
      }
    } catch (err) {
      console.error("Assign error:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignApplicant = async (applicantId: string) => {
    try {
      const res = await fetch("/api/admin/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": adminPasscode,
        },
        body: JSON.stringify({
          action: "UNASSIGN_FROM_COHORT",
          applicantIds: [applicantId],
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await fetchData();
      }
    } catch (err) {
      console.error("Unassign error:", err);
    }
  };

  const handleRescheduleCohort = (cohortId: string, newStartDate: string) => {
    const { startDate, endDate, formattedRange } = calculate3WeekCohortDates(newStartDate);
    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id === cohortId) {
          const cohortNumMatch = c.name.match(/Cohort\s+(\d+)/);
          const num = cohortNumMatch ? cohortNumMatch[1] : "1";
          return {
            ...c,
            startDate,
            endDate,
            name: "Cohort " + num + " (" + formattedRange + ")",
          };
        }
        return c;
      })
    );
  };

  const handleCreateCohort = () => {
    const nextNum = cohorts.length + 1;
    const lastCohort = cohorts[cohorts.length - 1];
    let startStr = "2026-11-23";
    if (lastCohort) {
      const d = new Date(lastCohort.endDate);
      d.setDate(d.getDate() + 2); // Monday after Saturday
      startStr = d.toISOString().split("T")[0];
    }
    const newC = createDefaultCohort(nextNum, startStr);
    setCohorts((prev) => [...prev, newC]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-100 rounded-3xl shadow-2xl border border-slate-300 w-full max-w-[1400px] h-[92vh] flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 text-xl font-black shadow-lg shadow-amber-500/20">
              📅
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Schedule & Cohort Management</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  90 Per Cohort • 3 Weeks (Mon–Sat)
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Visual cohort planning, drag-and-drop scheduling & applicant class rosters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveView("calendar")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                  (activeView === "calendar"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white")
                }
              >
                📅 Visual Calendar
              </button>
              <button
                onClick={() => setActiveView("pool")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 " +
                  (activeView === "pool"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white")
                }
              >
                <span>👥 Unassigned Pool</span>
                <span className="px-1.5 py-0.2 rounded-full bg-sky-500 text-white text-[10px] font-black">
                  {unscheduledApps.length}
                </span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Visual Calendar (8 Cols) */}
          <div className={(activeView === "calendar" ? "block lg:col-span-8" : "hidden lg:block lg:col-span-7") + " h-full flex flex-col"}>
            <VisualScheduleCalendar
              cohorts={activeCohorts}
              applications={approvedApplications}
              onSelectCohort={(c) => setSelectedCohort(c)}
              onRescheduleCohort={handleRescheduleCohort}
              onCreateCohort={handleCreateCohort}
              onDropApplicantToCohort={(appId, cId, sKey) => {
                const targetC = activeCohorts.find((c) => c.id === cId);
                const slotLabel = sKey === "early"
                  ? "Early morning 6am to 10am"
                  : sKey === "mid"
                  ? "Mid morning 10am to 2pm"
                  : "Late afternoon 2pm to 6pm";
                if (targetC) {
                  handleAssignApplicants([appId], targetC.id, slotLabel, targetC.name);
                }
              }}
            />
          </div>

          {/* Right Panel: Applicant Pool (4 Cols) */}
          <div className={(activeView === "pool" ? "block lg:col-span-12" : "hidden lg:block lg:col-span-5") + " h-full flex flex-col"}>
            <ApplicantAssignmentPool
              applicants={unscheduledApps}
              cohorts={activeCohorts}
              onAssignApplicants={handleAssignApplicants}
              isAssigning={isAssigning}
            />
          </div>
        </div>

        {/* Cohort Detail & Class Roster Modal */}
        {selectedCohort && (
          <CohortDetailModal
            cohort={selectedCohort}
            enrolledApplicants={approvedApplications.filter((a) => {
              const p = a.training_purpose || "";
              return p.includes(selectedCohort.name) || p.includes(selectedCohort.code);
            })}
            onClose={() => setSelectedCohort(null)}
            onUnassignApplicant={handleUnassignApplicant}
            onMoveShift={async (appId, targetSlot) => {
              await handleAssignApplicants([appId], selectedCohort.id, targetSlot, selectedCohort.name);
            }}
          />
        )}
      </div>
    </div>
  );
}
