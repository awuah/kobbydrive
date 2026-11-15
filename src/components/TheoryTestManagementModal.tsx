"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TheoryInvitation, TheoryTestResult } from "@/lib/theory-store";
import {
  FileText,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  RefreshCw,
  Send,
  ExternalLink,
  ChevronRight,
  X,
  Eye,
  Trash2,
  Copy,
  BookOpen,
  HelpCircle,
  BarChart2,
  Users,
} from "lucide-react";

interface TheoryTestManagementModalProps {
  onClose: () => void;
  adminPasscode: string;
}

export default function TheoryTestManagementModal({
  onClose,
  adminPasscode,
}: TheoryTestManagementModalProps) {
  const [activeTab, setActiveTab] = useState<"results" | "invitations" | "invite">("results");
  const [invitations, setInvitations] = useState<TheoryInvitation[]>([]);
  const [results, setResults] = useState<TheoryTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<TheoryTestResult | null>(null);

  // Invite tab state
  const [manualRef, setManualRef] = useState("");
  const [sendSms, setSendSms] = useState(true);
  const [inviteNotes, setInviteNotes] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);
  const [inviteErrorMsg, setInviteErrorMsg] = useState<string | null>(null);

  const fetchTheoryData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/theory/admin", {
        headers: { Authorization: `Bearer ${adminPasscode}` },
      });
      const data = await res.json();
      if (data.success) {
        setInvitations(data.invitations || []);
        setResults(data.results || []);
      }
    } catch (err) {
      console.error("Failed to load theory data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheoryData();
  }, [adminPasscode]);

  // Derived metrics
  const totalInvited = invitations.length;
  const totalAttempts = results.length;
  
  // Group results by candidate to compute passed / remedial
  const candidateSummary = useMemo(() => {
    const map = new Map<string, {
      applicationNumber: string;
      candidateName: string;
      phoneNumber: string;
      attempts: TheoryTestResult[];
      bestScore: number;
      bestPercentage: number;
      hasPassed: boolean;
      latestAttempt: TheoryTestResult;
    }>();

    for (const r of results) {
      const existing = map.get(r.applicationNumber);
      if (!existing) {
        map.set(r.applicationNumber, {
          applicationNumber: r.applicationNumber,
          candidateName: r.candidateName,
          phoneNumber: r.phoneNumber,
          attempts: [r],
          bestScore: r.score,
          bestPercentage: r.percentage,
          hasPassed: r.percentage >= 80,
          latestAttempt: r,
        });
      } else {
        existing.attempts.push(r);
        if (r.percentage > existing.bestPercentage) {
          existing.bestScore = r.score;
          existing.bestPercentage = r.percentage;
        }
        if (r.percentage >= 80) existing.hasPassed = true;
        // Keep latest
        if (new Date(r.completedAt) > new Date(existing.latestAttempt.completedAt)) {
          existing.latestAttempt = r;
        }
      }
    }

    return Array.from(map.values());
  }, [results]);

  const passedCandidatesCount = candidateSummary.filter((c) => c.hasPassed).length;
  const remedialCandidatesCount = candidateSummary.filter((c) => !c.hasPassed).length;
  const averageScore = candidateSummary.length > 0
    ? Math.round(candidateSummary.reduce((acc, c) => acc + c.bestPercentage, 0) / candidateSummary.length)
    : 0;

  // Filtered candidate results
  const filteredCandidates = candidateSummary.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.candidateName.toLowerCase().includes(q) ||
      c.applicationNumber.toLowerCase().includes(q) ||
      c.phoneNumber.includes(q)
    );
  });

  // Filtered invitations
  const filteredInvitations = invitations.filter((inv) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      inv.candidateName.toLowerCase().includes(q) ||
      inv.applicationNumber.toLowerCase().includes(q) ||
      inv.phoneNumber.includes(q)
    );
  });

  // Handle Revoke
  const handleRevoke = async (appId: string) => {
    if (!confirm("Revoke this candidate's theory test access?")) return;
    try {
      const res = await fetch("/api/theory/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPasscode}`,
        },
        body: JSON.stringify({ action: "REVOKE_INVITATION", applicationId: appId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTheoryData();
      }
    } catch (err) {
      console.error("Revoke error:", err);
    }
  };

  // Handle Manual Invite by Reference or Phone
  const handleManualInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSuccessMsg(null);
    setInviteErrorMsg(null);

    const ref = manualRef.trim();
    if (!ref) {
      setInviteErrorMsg("Please enter an Application Reference Number (e.g. KD-2026-XXXX).");
      return;
    }

    setInviting(true);
    try {
      // First find application ID by reference
      const searchRes = await fetch(`/api/admin?search=${encodeURIComponent(ref)}&limit=1`, {
        headers: { Authorization: `Bearer ${adminPasscode}` },
      });
      const searchData = await searchRes.json();
      
      const app = searchData?.data?.[0];
      if (!app || app.application_number.toLowerCase() !== ref.toLowerCase()) {
        setInviteErrorMsg(`No registered applicant found with reference "${ref}".`);
        setInviting(false);
        return;
      }

      const res = await fetch("/api/theory/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPasscode}`,
        },
        body: JSON.stringify({
          action: "INVITE_APPLICANTS",
          applicantIds: [app.id],
          sendSms,
          customNote: inviteNotes || "Individual invitation from admin dashboard",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInviteSuccessMsg(`Successfully invited ${app.surname} ${app.last_name} (${app.application_number})!`);
        setManualRef("");
        setInviteNotes("");
        fetchTheoryData();
      } else {
        setInviteErrorMsg(data.error || "Failed to invite applicant.");
      }
    } catch (err: any) {
      setInviteErrorMsg(err.message || "Network error occurred.");
    } finally {
      setInviting(false);
    }
  };

  const copyTestLink = (ref: string) => {
    const url = `${window.location.origin}/theory-test?ref=${encodeURIComponent(ref)}`;
    navigator.clipboard.writeText(url);
    alert(`Copied test link:\n${url}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-100 rounded-3xl shadow-2xl border border-slate-300 w-full max-w-[1240px] h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-brand-500/20">
              📝
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Ghana Driver's Guide Theory Exam</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
                  Pass Mark: 80% • DVLA Syllabus
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Official curriculum questions, score monitoring, remedial retakes & automated simulator invitations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTheoryData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Exam Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-white border-b border-slate-200">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Invited Students</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalInvited}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Admin authorized batches</div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between text-blue-700 text-xs font-semibold">
              <span>Tests Submitted</span>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-900 mt-1">{totalAttempts}</div>
            <div className="text-[10px] text-blue-600 mt-0.5">Total attempts recorded</div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
              <span>Passed (&ge; 80%)</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-900 mt-1">{passedCandidatesCount}</div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
              Ready for Simulator Training
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
              <span>In Remedial (&lt; 80%)</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-900 mt-1">{remedialCandidatesCount}</div>
            <div className="text-[10px] text-amber-700 mt-0.5">Retaking & reviewing guide</div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-purple-700 text-xs font-semibold">
              <span>Average Best Score</span>
              <Award className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-900 mt-1">{averageScore}%</div>
            <div className="text-[10px] text-purple-700 mt-0.5">Overall cohort mastery</div>
          </div>
        </div>

        {/* Tabs & Search Navigation */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("results")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "results"
                  ? "bg-white text-brand-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📊 Test Scores ({candidateSummary.length})
            </button>
            <button
              onClick={() => setActiveTab("invitations")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "invitations"
                  ? "bg-white text-brand-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✉️ Cohort Invitations ({invitations.length})
            </button>
            <button
              onClick={() => setActiveTab("invite")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "invite"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ➕ Invite Individual Candidate
            </button>
          </div>

          {activeTab !== "invite" && (
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, ref, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
          {/* TAB 1: Test Scores */}
          {activeTab === "results" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {filteredCandidates.length === 0 ? (
                <div className="py-16 text-center">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-bold text-sm">No exam records found</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {searchQuery
                      ? "No records matching your search filter."
                      : "Once invited candidates complete their theory examination, their scores and answer reviews will appear here."}
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Reference / Candidate</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3 text-center">Attempts</th>
                      <th className="p-3 text-center">Best Score</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Last Attempt</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredCandidates.map((c) => (
                      <tr key={c.applicationNumber} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-900 block text-xs">
                            {c.applicationNumber}
                          </span>
                          <span className="text-slate-600 font-semibold">{c.candidateName}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{c.phoneNumber}</td>
                        <td className="p-3 text-center font-bold">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs border border-slate-200">
                            {c.attempts.length} {c.attempts.length === 1 ? "time" : "times"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-black text-slate-900">
                              {c.bestScore} / {c.latestAttempt.totalQuestions}
                            </span>
                            <span
                              className={`text-[10px] font-bold ${
                                c.bestPercentage >= 80 ? "text-emerald-700" : "text-amber-700"
                              }`}
                            >
                              ({c.bestPercentage}%)
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {c.hasPassed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle className="w-3.5 h-3.5" /> PASSED (&ge; 80%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertCircle className="w-3.5 h-3.5" /> RETESTING (&lt; 80%)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">
                          {new Date(c.latestAttempt.completedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedResult(c.latestAttempt)}
                            className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer border border-brand-200"
                          >
                            <Eye className="w-3.5 h-3.5" /> Review Answers
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: Invitations */}
          {activeTab === "invitations" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {filteredInvitations.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-bold text-sm">No invitations found</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Select applicants in the main dashboard and click "Invite to Theory Test", or use the Invite tab.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Reference / Candidate</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Invited By / Date</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Best %</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredInvitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-900 block text-xs">
                            {inv.applicationNumber}
                          </span>
                          <span className="text-slate-600 font-semibold">{inv.candidateName}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{inv.phoneNumber}</td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-700 block">{inv.invitedBy}</span>
                          <span className="text-slate-400 text-[10px]">
                            {new Date(inv.invitedAt).toLocaleDateString("en-GB")}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {inv.status === "passed" ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Passed
                            </span>
                          ) : inv.status === "remedial" ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              Remedial
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              Invited
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center font-bold">
                          {inv.bestScorePercentage ? `${inv.bestScorePercentage}%` : "—"}
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          <button
                            onClick={() => copyTestLink(inv.applicationNumber)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy student test link"
                          >
                            <Copy className="w-3 h-3" /> Link
                          </button>
                          <button
                            onClick={() => handleRevoke(inv.applicationId)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer border border-rose-200"
                            title="Revoke exam access"
                          >
                            <Trash2 className="w-3 h-3" /> Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 3: Invite Form */}
          {activeTab === "invite" && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-brand-600" /> Invite Individual Candidate
                </h3>
                <p className="text-xs text-slate-500">
                  Authorize a student to sit for the Ghana Driver's Guide Theory Exam. Once authorized, they can log into the portal and take the test.
                </p>
              </div>

              {inviteSuccessMsg && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{inviteSuccessMsg}</span>
                </div>
              )}

              {inviteErrorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{inviteErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleManualInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Reference Number *
                  </label>
                  <input
                    type="text"
                    value={manualRef}
                    onChange={(e) => setManualRef(e.target.value.toUpperCase())}
                    placeholder="e.g. KD-2026-0042"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 uppercase focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Enter the exact reference number assigned during registration.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Send Instant SMS with Personalized Test Link
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-500 pl-6">
                    Dispatches an SMS via Arkesel informing the student of their theory test schedule with a direct click link.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internal Admin Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={inviteNotes}
                    onChange={(e) => setInviteNotes(e.target.value)}
                    placeholder="e.g. Cohort 2 Priority Candidate"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-brand-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {inviting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Authorizing & Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Grant Exam Access & Send Invitation
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Answer Review Modal Drawer */}
      {selectedResult && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-brand-400 block">
                  {selectedResult.applicationNumber}
                </span>
                <h3 className="text-base font-black">
                  {selectedResult.candidateName} — Exam Review
                </h3>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Overview */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                    selectedResult.passed
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {selectedResult.percentage}%
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Test Result</div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {selectedResult.score} out of {selectedResult.totalQuestions} questions correct
                  </div>
                </div>
              </div>

              <div>
                {selectedResult.passed ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> PASSED (Simulator SMS Sent)
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> UNDER 80% (In Retake Review)
                  </span>
                )}
              </div>
            </div>

            {/* Questions Review List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">
                  Detailed Question Analysis & Guide References
                </h4>
                <p className="text-xs text-slate-500">
                  {!selectedResult.wrongAnswers || selectedResult.wrongAnswers.length === 0
                    ? "Flawless score! All questions were answered correctly according to the Ghana Driver's Guide."
                    : `Applicant answered ${selectedResult.wrongAnswers.length} question(s) incorrectly. Inspect their selection vs the statutory DVLA answer below:`}
                </p>
              </div>

              {selectedResult.wrongAnswers?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">
                      Q{idx + 1}. {item.question}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 font-bold text-slate-700 shrink-0">
                      {item.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                      <span className="text-[10px] font-bold text-rose-700 block uppercase">
                        Candidate Chose:
                      </span>
                      <span className="font-semibold text-rose-900">
                        {item.selectedAnswer || "Unanswered"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                        Statutory Correct Answer:
                      </span>
                      <span className="font-semibold text-emerald-900">
                        {item.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {(item.explanation || item.guideReference) && (
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                      <span className="font-bold text-[10px] text-blue-700 block uppercase mb-0.5">
                        DVLA Guide Citation & Rule: {item.guideReference ? `(${item.guideReference})` : ""}
                      </span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
