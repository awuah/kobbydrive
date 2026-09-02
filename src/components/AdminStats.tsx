"use client";

import React from "react";
import { DashboardStats } from "@/lib/types";
import {
  Users,
  Clock,
  CheckCircle,
  GraduationCap,
  XCircle,
  TrendingUp,
  Award,
} from "lucide-react";

interface AdminStatsProps {
  stats: DashboardStats;
  onFilterStatus?: (status: string) => void;
  activeStatus?: string;
}

export default function AdminStats({ stats, onFilterStatus, activeStatus }: AdminStatsProps) {
  const cards = [
    {
      id: "all",
      label: "Total Applications",
      count: stats.total,
      icon: Users,
      color: "text-slate-900",
      bg: "bg-slate-100",
      border: "border-slate-200",
      activeBg: "ring-2 ring-slate-900 bg-slate-50",
    },
    {
      id: "pending",
      label: "Pending Review",
      count: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      activeBg: "ring-2 ring-amber-500 bg-amber-50/70",
    },
    {
      id: "under_review",
      label: "Under Review",
      count: stats.under_review,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      activeBg: "ring-2 ring-blue-500 bg-blue-50/70",
    },
    {
      id: "approved",
      label: "Approved Candidates",
      count: stats.approved,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      activeBg: "ring-2 ring-emerald-500 bg-emerald-50/70",
    },
    {
      id: "in_training",
      label: "In Training",
      count: stats.in_training,
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      activeBg: "ring-2 ring-purple-500 bg-purple-50/70",
    },
    {
      id: "completed",
      label: "Graduated / Completed",
      count: stats.completed,
      icon: GraduationCap,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      activeBg: "ring-2 ring-green-600 bg-green-50/70",
    },
    {
      id: "rejected",
      label: "Rejected / Declined",
      count: stats.rejected,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      activeBg: "ring-2 ring-rose-500 bg-rose-50/70",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onFilterStatus && onFilterStatus(card.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${card.border} ${
              isActive ? card.activeBg : "bg-white hover:border-slate-300 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-900">{card.count}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5 truncate">{card.label}</div>
          </button>
        );
      })}
    </div>
  );
}
