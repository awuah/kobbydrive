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
