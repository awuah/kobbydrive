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

  const gm = stats.genderMetrics;

  return (
    <div className="space-y-4">
      {/* Main KPI Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive = activeStatus === card.id;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onFilterStatus && onFilterStatus(card.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${card.border} ${
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

      {/* Gender Demographics Tracking Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
              ⚤
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gender Demographics & Tracking Metrics</h3>
              <p className="text-xs text-slate-500">
                Comparative tracking for Men and Women across enrollment stages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-sky-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Men
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Women
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Registered Applicants */}
          {(() => {
            const m = gm?.registered.male ?? 0;
            const f = gm?.registered.female ?? 0;
            const t = (m + f) || 1;
            const mPct = Math.round((m / t) * 100);
            const fPct = 100 - mPct;

            return (
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-700" /> Registered Applicants
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {m + f} Total
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-sky-100 shadow-xs">
                    <div className="text-[11px] font-semibold text-sky-600 flex items-center justify-between">
                      <span>Men</span>
                      <span className="font-bold">{mPct}%</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{m}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-rose-100 shadow-xs">
                    <div className="text-[11px] font-semibold text-rose-600 flex items-center justify-between">
                      <span>Women</span>
                      <span className="font-bold">{fPct}%</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{f}</div>
                  </div>
                </div>

                {/* Split Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex shadow-inner">
                  <div style={{ width: `${mPct}%` }} className="bg-sky-500 h-full transition-all duration-500" />
                  <div style={{ width: `${fPct}%` }} className="bg-rose-500 h-full transition-all duration-500" />
                </div>
              </div>
            );
          })()}

          {/* 2. Currently In Training */}
          {(() => {
            const m = gm?.in_training.male ?? 0;
            const f = gm?.in_training.female ?? 0;
            const t = (m + f) || 1;
            const mPct = (m + f) > 0 ? Math.round((m / t) * 100) : 0;
            const fPct = (m + f) > 0 ? 100 - mPct : 0;

            return (
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-700" /> In Active Training
                  </span>
                  <span className="text-xs font-extrabold text-purple-900 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                    {m + f} Trainees
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-sky-100 shadow-xs">
                    <div className="text-[11px] font-semibold text-sky-600 flex items-center justify-between">
                      <span>Men</span>
                      <span className="font-bold">{mPct}%</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{m}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-rose-100 shadow-xs">
                    <div className="text-[11px] font-semibold text-rose-600 flex items-center justify-between">
                      <span>Women</span>
                      <span className="font-bold">{fPct}%</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{f}</div>
                  </div>
                </div>

                {/* Split Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex shadow-inner">
                  <div style={{ width: `${mPct}%` }} className="bg-sky-500 h-full transition-all duration-500" />
                  <div style={{ width: `${fPct}%` }} className="bg-rose-500 h-full transition-all duration-500" />
                </div>
              </div>
            );
          })()}

          {/* 3. Graduated / Completed Students */}
          {(() => {
            const m = gm?.completed.male ?? 0;
            const f = gm?.completed.female ?? 0;
            const t = (m + f) || 1;
            const mPct = (m + f) > 0 ? Math.round((m / t) * 100) : 0;
            const fPct = (m + f) > 0 ? 100 - mPct : 0;

            return (
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" /> Graduated Students
                  </span>
                  <span className="text-xs font-extrabold text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    {m + f} Certified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-sky-100 shadow-xs">
                    <div className="text-[11px] font-semibold text-sky-600 flex items-center justify-between">
                      <span>Men</span>
                      <span className="font-bold">{mPct}%</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{m}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-rose-100 shadow-xs">
                    <div className="text-[11px] font-semibold text-rose-600 flex items-center justify-between">
                      <span>Women</span>
                      <span className="font-bold">{fPct}%</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{f}</div>
                  </div>
                </div>

                {/* Split Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex shadow-inner">
                  <div style={{ width: `${mPct}%` }} className="bg-sky-500 h-full transition-all duration-500" />
                  <div style={{ width: `${fPct}%` }} className="bg-rose-500 h-full transition-all duration-500" />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
