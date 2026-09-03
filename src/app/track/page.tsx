"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Application } from "@/lib/types";
import { formatApplicationStatus, formatDate, formatDateTime } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  Clock,
  Car,
  AlertCircle,
  FileText,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Award,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [query, setQuery] = useState(initialRef);
  const [results, setResults] = useState<Application[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const fetchStatus = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError("Please enter an Application Number or Phone Number.");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const isPhone = /^[0-9+\s-]{7,15}$/.test(searchQuery.trim());
      const param = isPhone ? `phone=${encodeURIComponent(searchQuery.trim())}` : `ref=${encodeURIComponent(searchQuery.trim())}`;

      const res = await fetch(`/api/applications?${param}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Application not found.");
      }

      setResults(data.data);
    } catch (err: any) {
      setError(err.message || "No application found matching your search.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchStatus(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(query);
  };

  const getStepProgress = (status: string) => {
    const steps = [
      { key: "pending", label: "Application Submitted" },
      { key: "under_review", label: "Under Review & Verification" },
      { key: "approved", label: "Approved & Scheduled" },
      { key: "in_training", label: "In Driving Training" },
      { key: "completed", label: "Graduated / Certified" },
    ];

    if (status === "rejected") {
      return { stepIndex: -1, isRejected: true, steps };
    }

    const indexMap: Record<string, number> = {
      pending: 0,
      under_review: 1,
      approved: 2,
      in_training: 3,
      completed: 4,
    };

    return { stepIndex: indexMap[status] ?? 0, isRejected: false, steps };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full border border-brand-200">
          Applicant Status Portal
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Application Progress
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Enter your official <strong>Application Number</strong> (e.g. KBD-2026-XXXXX) or registered <strong>Phone Number</strong> to check your enrollment status.
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Application Number (e.g. KBD-2026-XXXXX) or Phone"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Check Status
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Display */}
      {results && results.length > 0 && (
        <div className="space-y-6">
          {results.map((app) => {
            const statusInfo = formatApplicationStatus(app.status);
            const { stepIndex, isRejected, steps } = getStepProgress(app.status);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-6 p-6 sm:p-8"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      Application Reference
                    </span>
                    <h2 className="text-2xl font-mono font-extrabold text-brand-700 mt-0.5">
                      {app.application_number}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Applicant: <span className="font-semibold text-slate-800">{app.title} {app.surname} {app.last_name}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Current Status</span>
                    <span
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border mt-1 ${statusInfo.badgeClass}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="py-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                    Program Progress Timeline
                  </h3>

                  {isRejected ? (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <div>
                        <strong>Application Not Selected:</strong> We regret to inform you that your application was not approved for this batch. Thank you for your interest in the KobbyDrive initiative.
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {steps.map((step, idx) => {
                        const isCompleted = idx <= stepIndex;
                        const isCurrent = idx === stepIndex;

                        return (
                          <div
                            key={step.key}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isCurrent
                                ? "bg-brand-50 border-brand-300 ring-2 ring-brand-500/20 shadow-sm"
                                : isCompleted
                                ? "bg-slate-50 border-slate-200 text-slate-700"
                                : "bg-slate-50/40 border-slate-100 text-slate-400"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <div
                                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                  isCompleted
                                    ? "bg-brand-600 text-white"
                                    : "bg-slate-200 text-slate-500"
                                }`}
                              >
                                {isCompleted ? "✓" : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  isCurrent ? "text-brand-700" : isCompleted ? "text-slate-700" : "text-slate-400"
                                }`}
                              >
                                Step {idx + 1}
                              </span>
                            </div>
                            <p className="text-xs font-semibold leading-tight">{step.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Dossier Information Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">ID Document</span>
                    <span className="font-semibold text-slate-800">
                      {app.id_type}: {app.id_number}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Takoradi Locality</span>
                    <span className="font-semibold text-slate-800">
                      {app.electoral_area || "Amanful West"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Training Purpose</span>
                    <span className="font-semibold text-brand-700">
                      {app.training_purpose || "Personal"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Registered Phone</span>
                    <span className="font-semibold text-slate-800">{app.phone_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Submission Date</span>
                    <span className="font-semibold text-slate-800">{formatDate(app.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {searched && results && results.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Application Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any application matching &quot;{query}&quot;. Please double check your reference number or phone number and try again.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Submit a new application <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
