import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApplicationStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `KBD-${year}-${randomChars}${randomDigits}`;
}

export function formatApplicationStatus(status: ApplicationStatus | string): {
  label: string;
  badgeClass: string;
  bgClass: string;
  borderClass: string;
  textColor: string;
} {
  switch (status) {
    case "pending":
      return {
        label: "Pending Review",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        bgClass: "bg-amber-50",
        borderClass: "border-amber-300",
        textColor: "text-amber-700",
      };
    case "under_review":
      return {
        label: "Under Review",
        badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
        bgClass: "bg-blue-50",
        borderClass: "border-blue-300",
        textColor: "text-blue-700",
      };
    case "approved":
      return {
        label: "Approved",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        bgClass: "bg-emerald-50",
        borderClass: "border-emerald-300",
        textColor: "text-emerald-700",
      };
    case "in_training":
      return {
        label: "In Training",
        badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
        bgClass: "bg-purple-50",
        borderClass: "border-purple-300",
        textColor: "text-purple-700",
      };
    case "completed":
      return {
        label: "Completed / Graduated",
        badgeClass: "bg-green-100 text-green-900 border-green-300",
        bgClass: "bg-green-50",
        borderClass: "border-green-400",
        textColor: "text-green-800",
      };
    case "rejected":
      return {
        label: "Not Selected / Rejected",
        badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
        bgClass: "bg-rose-50",
        borderClass: "border-rose-300",
        textColor: "text-rose-700",
      };
    default:
      return {
        label: status || "Unknown",
        badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
        bgClass: "bg-slate-50",
        borderClass: "border-slate-300",
        textColor: "text-slate-700",
      };
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export const TRAINING_SCHEDULES = [
  {
    id: "Early morning 6am to 10am",
    label: "Early morning",
    time: "6:00 AM – 10:00 AM",
    icon: "sunrise",
    desc: "Early session before daytime commitments",
  },
  {
    id: "Mid morning 10am to 2pm",
    label: "Mid morning",
    time: "10:00 AM – 2:00 PM",
    icon: "sun",
    desc: "Optimal daylight practical driving session",
  },
  {
    id: "Late afternoon 2pm to 6pm",
    label: "Late afternoon",
    time: "2:00 PM – 6:00 PM",
    icon: "sunset",
    desc: "Afternoon to early evening practical driving slot",
  },
] as const;

export function parseTrainingDetails(trainingPurposeRaw?: string | null): {
  purpose: string;
  schedule: string;
} {
  if (!trainingPurposeRaw || !trainingPurposeRaw.trim()) {
    return { purpose: "Personal", schedule: "unscheduled" };
  }

  const raw = trainingPurposeRaw.trim();
  if (raw.includes("|| Schedule: ")) {
    const parts = raw.split("|| Schedule: ");
    return {
      purpose: parts[0].trim() || "Personal",
      schedule: parts[1].trim() || "unscheduled",
    };
  }

  if (raw.includes("[Schedule: ") && raw.endsWith("]")) {
    const parts = raw.slice(0, -1).split("[Schedule: ");
    return {
      purpose: parts[0].trim() || "Personal",
      schedule: parts[1].trim() || "unscheduled",
    };
  }

  return { purpose: raw, schedule: "unscheduled" };
}

export function formatTrainingScheduleBadge(schedule?: string | null): {
  label: string;
  badgeClass: string;
  isUnscheduled: boolean;
} {
  if (!schedule || schedule.toLowerCase() === "unscheduled") {
    return {
      label: "Unscheduled",
      badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
      isUnscheduled: true,
    };
  }

  const s = schedule.toLowerCase();
  if (s.includes("early") || s.includes("6am")) {
    return {
      label: "🌅 Early morning (6am - 10am)",
      badgeClass: "bg-amber-50 text-amber-900 border-amber-300 font-semibold",
      isUnscheduled: false,
    };
  }
  if (s.includes("mid") || s.includes("10am")) {
    return {
      label: "☀️ Mid morning (10am - 2pm)",
      badgeClass: "bg-sky-50 text-sky-900 border-sky-300 font-semibold",
      isUnscheduled: false,
    };
  }
  if (s.includes("late") || s.includes("afternoon") || s.includes("2pm")) {
    return {
      label: "🌇 Late afternoon (2pm - 6pm)",
      badgeClass: "bg-indigo-50 text-indigo-900 border-indigo-300 font-semibold",
      isUnscheduled: false,
    };
  }

  return {
    label: schedule,
    badgeClass: "bg-brand-50 text-brand-900 border-brand-300 font-semibold",
    isUnscheduled: false,
  };
}
