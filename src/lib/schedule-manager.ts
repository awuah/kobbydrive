import { TrainingCohort, CohortSlot, TrainingScheduleType, Application } from "./types";

export const MAX_COHORT_CAPACITY = 90;
export const MAX_SLOT_CAPACITY = 30; // 3 slots x 30 = 90 total

export const SCHEDULE_SLOT_CONFIG = [
  {
    id: "early",
    label: "Early morning 6am to 10am" as TrainingScheduleType,
    timeRange: "6:00 AM – 10:00 AM",
    maxCapacity: MAX_SLOT_CAPACITY,
  },
  {
    id: "mid",
    label: "Mid morning 10am to 2pm" as TrainingScheduleType,
    timeRange: "10:00 AM – 2:00 PM",
    maxCapacity: MAX_SLOT_CAPACITY,
  },
  {
    id: "late",
    label: "Late afternoon 2pm to 6pm" as TrainingScheduleType,
    timeRange: "2:00 PM – 6:00 PM",
    maxCapacity: MAX_SLOT_CAPACITY,
  },
] as const;

/**
 * Given a start date string (YYYY-MM-DD), adjusts to the Monday of that week if not Monday,
 * and calculates the 3-week completion date on Saturday (19 days later, 18 training days Mon-Sat).
 */
export function calculate3WeekCohortDates(startDateStr: string): {
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string; // YYYY-MM-DD (Saturday)
  formattedRange: string;
} {
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) {
    const today = new Date();
    return calculate3WeekCohortDates(today.toISOString().split("T")[0]);
  }

  // Adjust to Monday if not Monday (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const day = start.getDay();
  const diffToMonday = day === 0 ? 1 : day === 1 ? 0 : 1 - day + (day > 1 ? 0 : 7);
  start.setDate(start.getDate() + diffToMonday);

  // 3 weeks of Mon-Sat:
  // Week 1: Mon (day 0) to Sat (day 5)
  // Week 2: Mon (day 7) to Sat (day 12)
  // Week 3: Mon (day 14) to Sat (day 19)
  const end = new Date(start);
  end.setDate(start.getDate() + 19);

  const startISO = start.toISOString().split("T")[0];
  const endISO = end.toISOString().split("T")[0];

  const startFmt = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endFmt = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    startDate: startISO,
    endDate: endISO,
    formattedRange: `${startFmt} – ${endFmt}`,
  };
}

/**
 * Creates a default cohort starting on a given Monday.
 */
export function createDefaultCohort(
  cohortNumber: number,
  startDateStr: string
): TrainingCohort {
  const { startDate, endDate, formattedRange } = calculate3WeekCohortDates(startDateStr);
  const code = `COHORT-${new Date().getFullYear()}-${String(cohortNumber).padStart(2, "0")}`;
  const name = `Cohort ${cohortNumber} (${formattedRange})`;

  const now = new Date().toISOString();

  return {
    id: `cohort_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    code,
    name,
    startDate,
    endDate,
    maxCapacity: MAX_COHORT_CAPACITY,
    status: "upcoming",
    slots: {
      early: {
        id: "early",
        label: "Early morning 6am to 10am",
        timeRange: "6:00 AM – 10:00 AM",
        maxCapacity: MAX_SLOT_CAPACITY,
        enrolledCount: 0,
        applicantIds: [],
      },
      mid: {
        id: "mid",
        label: "Mid morning 10am to 2pm",
        timeRange: "10:00 AM – 2:00 PM",
        maxCapacity: MAX_SLOT_CAPACITY,
        enrolledCount: 0,
        applicantIds: [],
      },
      late: {
        id: "late",
        label: "Late afternoon 2pm to 6pm",
        timeRange: "2:00 PM – 6:00 PM",
        maxCapacity: MAX_SLOT_CAPACITY,
        enrolledCount: 0,
        applicantIds: [],
      },
    },
    totalEnrolled: 0,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Maps a training schedule string to one of the 3 slot keys ('early', 'mid', 'late').
 */
export function getSlotKeyFromSchedule(scheduleStr?: string | null): "early" | "mid" | "late" {
  if (!scheduleStr) return "early";
  const s = scheduleStr.toLowerCase();
  if (s.includes("mid") || s.includes("10am")) return "mid";
  if (s.includes("late") || s.includes("afternoon") || s.includes("2pm")) return "late";
  return "early";
}

/**
 * Returns color classes and status text based on capacity percentage.
 */
export function getCapacityBadge(enrolled: number, max: number = MAX_COHORT_CAPACITY): {
  label: string;
  badgeClass: string;
  progressColor: string;
  isFull: boolean;
  percentage: number;
} {
  const percentage = Math.min(100, Math.round((enrolled / max) * 100));
  if (enrolled >= max) {
    return {
      label: `Full (${enrolled}/${max})`,
      badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
      progressColor: "bg-rose-500",
      isFull: true,
      percentage: 100,
    };
  }
  if (percentage >= 70) {
    return {
      label: `Filling Up (${enrolled}/${max})`,
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      progressColor: "bg-amber-500",
      isFull: false,
      percentage,
    };
  }
  return {
    label: `Available (${enrolled}/${max})`,
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    progressColor: "bg-emerald-500",
    isFull: false,
    percentage,
  };
}
