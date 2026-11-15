"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Award,
  Sparkles,
  Phone,
  Search,
  Loader2,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  FileText,
  AlertTriangle,
  Send,
  Timer,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
}

interface TestResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  categoryBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  wrongAnswers: Array<{
    questionId: string;
    question: string;
    category: string;
    selectedAnswer: string;
    correctAnswer: string;
    explanation: string;
    guideReference: string;
  }>;
  completedAt: string;
  smsDispatched: boolean;
}

function TheoryTestContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || searchParams.get("phone") || "";

  const [identifier, setIdentifier] = useState(initialRef);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Loaded Exam Session
  const [sessionData, setSessionData] = useState<{
    applicant: {
      id: string;
      applicationNumber: string;
      fullName: string;
      phoneNumber: string;
      electoralArea: string;
    };
    questions: Question[];
    totalQuestions: number;
    passPercentage: number;
  } | null>(null);

  // User Answers (Map: questionId -> selectedIndex)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  // Auto-verify if ref is in URL
  useEffect(() => {
    if (initialRef) {
      handleAccessTest(initialRef);
    }
  }, [initialRef]);

  const handleAccessTest = async (queryRef?: string) => {
    const q = (queryRef || identifier).trim();
    if (!q) {
      setAuthError("Please enter your Application Reference Number (e.g. KBD-2026-XXXX) or Phone Number.");
      return;
    }

    setCheckingAuth(true);
    setAuthError(null);

    try {
      const res = await fetch(`/api/theory/test?ref=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || "Unable to access the examination at this time.");
        setSessionData(null);
      } else {
        setSessionData({
          applicant: data.applicant,
          questions: data.questions,
          totalQuestions: data.totalQuestions,
          passPercentage: data.passPercentage || 80,
        });
        setAnswers({});
        setResult(null);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError("Network error. Please check your internet connection.");
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitTest = async () => {
    if (!sessionData) return;

    const answeredCount = Object.keys(answers).length;
    const unansweredCount = sessionData.totalQuestions - answeredCount;

    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit your examination now?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/theory/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: sessionData.applicant.id,
          applicationNumber: sessionData.applicant.applicationNumber,
          answers,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to submit exam.");
      } else {
        setResult(data.result);
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Fire celebratory confetti if student scored >= 80%
        if (data.result.passed) {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("Error submitting examination. Please check your internet connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Group questions by category
  const categories = sessionData
    ? Array.from(new Set(sessionData.questions.map((q) => q.category)))
    : [];

  const displayedQuestions = sessionData
    ? activeCategory === "all"
      ? sessionData.questions
      : sessionData.questions.filter((q) => q.category === activeCategory)
    : [];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = sessionData
    ? Math.round((answeredCount / sessionData.totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Official DVLA & Ghana Driver’s Guide Theory Curriculum
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Driving Theory Examination
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Test your knowledge of the official Ghana Driver’s Guide (L.I. 2180 / Act 683). A score of{" "}
            <span className="font-bold text-amber-400">80% or above</span> qualifies you for hands-on
            vehicle simulator handling training.
          </p>
        </div>

        {/* STEP 1: Applicant Verification & Gated Access Card */}
        {!sessionData && !result && (
          <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Cohort Scheduled Access</h3>
              <p className="text-xs text-slate-400">
                Students may take the test once scheduled by an administrator. Please enter your Application
                Reference Number or Registered Phone Number.
              </p>
            </div>

            {authError && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{authError}</div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAccessTest();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Application Ref or Phone Number
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. KBD-2026-1042 or 024XXXXXXX"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={checkingAuth}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {checkingAuth ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Cohort Schedule...
                  </>
                ) : (
                  <>
                    Enter Examination Portal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800/80">
              <Link
                href="/track"
                className="text-xs text-slate-400 hover:text-white transition-colors underline"
              >
                Forgot your Reference Number? Track your application here
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: Results & Remedial Review Screen (Shown After Submission) */}
        {result && sessionData && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-300">
            {/* Scorecard Banner */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden ${
                result.passed
                  ? "bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/50 shadow-emerald-950/50"
                  : "bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-500/50 shadow-amber-950/50"
              }`}
            >
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg border">
                {result.passed ? "🏆" : "⚠️"}
              </div>

              <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 bg-white/10 text-white">
                Attempt #{result.attemptNumber}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {result.passed
                  ? "Congratulations! You Passed the Theory Examination"
                  : "Examination Not Passed — Retake Recommended"}
              </h2>

              <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
                Candidate: <strong className="text-white">{sessionData.applicant.fullName}</strong> (Ref:{" "}
                <span className="font-mono text-cyan-400">{sessionData.applicant.applicationNumber}</span>)
              </p>

              {/* Score Display */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black text-white">
                    {result.score} / {result.totalQuestions}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Questions Correct</div>
                </div>

                <div className="h-12 w-px bg-slate-700 hidden sm:block" />

                <div className="text-center">
                  <div
                    className={`text-4xl sm:text-5xl font-black ${
                      result.passed ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {result.percentage}%
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                    Pass Mark: 80%
                  </div>
                </div>
              </div>

              {/* Simulator Alert Message */}
              {result.passed ? (
                <div className="mt-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-600/40 text-emerald-200 text-xs sm:text-sm max-w-2xl mx-auto text-left flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-300 font-bold mb-1">
                      📱 Next Step: Driving Simulator Training SMS Dispatched
                    </strong>
                    <span>
                      An automated SMS has been sent to your phone (<strong>{sessionData.applicant.phoneNumber}</strong>
                      ). Please be on alert for an upcoming notification with your exact date and time for Driving
                      Simulator Training at our center. The simulator is designed to build steering handling, pedal
                      coordination, and muscle memory before your actual on-road training car lessons.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-xl bg-amber-900/40 border border-amber-600/40 text-amber-200 text-xs sm:text-sm max-w-2xl mx-auto text-left flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold mb-1">
                      Retake Allowed Immediately
                    </strong>
                    <span>
                      You needed at least 80% to qualify for simulator scheduling. Review all your incorrect answers
                      and official explanations below, then click <strong>"Retake Examination"</strong> to try again
                      until you achieve 80%+!
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleRetake}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Examination
                </button>

                <Link
                  href="/track"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  Return to Status Tracker
                </Link>
              </div>
            </div>

            {/* Performance By Category Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-400" />
                Category Performance Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(result.categoryBreakdown).map(([category, stats]) => (
                  <div
                    key={category}
                    className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2"
                  >
                    <div className="text-xs font-bold text-slate-200 truncate" title={category}>
                      {category}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        {stats.correct} of {stats.total} correct
                      </span>
                      <span
                        className={`font-black ${
                          stats.percentage >= 80 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {stats.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          stats.percentage >= 80 ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Question Review (Incorrect Answers with Explanations) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  Study Review & Explanations ({result.wrongAnswers.length} missed)
                </h3>
              </div>

              {result.wrongAnswers.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 text-center text-slate-300">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="font-bold text-white">Perfect Score! No wrong answers.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    You demonstrated complete mastery of all chapters in the Ghana Driver's Guide.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {result.wrongAnswers.map((w, index) => (
                    <div
                      key={w.questionId}
                      className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800">
                          {w.category}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">Question #{index + 1}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-relaxed">{w.question}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-200">
                          <span className="block text-[10px] uppercase font-bold text-rose-400">
                            Your Selected Answer:
                          </span>
                          <span className="mt-0.5 block font-medium">{w.selectedAnswer}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                          <span className="block text-[10px] uppercase font-bold text-emerald-400">
                            Correct Answer:
                          </span>
                          <span className="mt-0.5 block font-bold">{w.correctAnswer}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="block font-bold text-amber-300">💡 Explanation & Guide Note:</span>
                        <p className="leading-relaxed">{w.explanation}</p>
                        <span className="block text-[10px] text-slate-500 font-mono pt-1">
                          Source: {w.guideReference}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Active Examination Questions Session */}
        {sessionData && !result && (
          <div className="space-y-6">
            {/* Candidate & Timer Status Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Candidate:</span>
                <span className="font-bold text-white text-base">
                  {sessionData.applicant.fullName}{" "}
                  <span className="text-xs font-mono text-cyan-400">
                    ({sessionData.applicant.applicationNumber})
                  </span>
                </span>
              </div>

              {/* Progress Count */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">
                    Answered: <strong className="text-white">{answeredCount}</strong> of{" "}
                    <strong>{sessionData.totalQuestions}</strong>
                  </div>
                  <div className="w-32 sm:w-44 bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-brand-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitTest}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Submit Test <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                All Chapters ({sessionData.totalQuestions})
              </button>

              {categories.map((cat) => {
                const count = sessionData.questions.filter((q) => q.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-brand-600 text-white shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {displayedQuestions.map((q, qIndex) => {
                const selectedOption = answers[q.id];
                const isAnswered = typeof selectedOption === "number";

                return (
                  <div
                    key={q.id}
                    className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all ${
                      isAnswered
                        ? "border-slate-700 bg-slate-900/90"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Category & Index Header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 bg-brand-950/80 px-2.5 py-0.5 rounded-full border border-brand-800">
                        {q.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {isAnswered ? (
                          <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Answered
                          </span>
                        ) : (
                          <span className="text-slate-500">Unanswered</span>
                        )}
                      </span>
                    </div>

                    {/* Question Prompt */}
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4 leading-relaxed">
                      <span className="text-brand-400 mr-1.5">{qIndex + 1}.</span>
                      {q.question}
                    </h3>

                    {/* Multiple Choice Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = selectedOption === optIndex;
                        const optionLabels = ["A", "B", "C", "D"];

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIndex)}
                            className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                              isSelected
                                ? "bg-brand-600/20 border-brand-500 text-white shadow-sm ring-1 ring-brand-500"
                                : "bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-300"
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? "bg-brand-500 text-white border-brand-400"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              {optionLabels[optIndex]}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Floating Submit Bar */}
            <div className="sticky bottom-4 bg-slate-900/95 border border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <span>Total Answered: </span>
                <strong className="text-white">
                  {answeredCount} / {sessionData.totalQuestions}
                </strong>
                {answeredCount < sessionData.totalQuestions && (
                  <span className="text-amber-400 ml-2 hidden sm:inline">
                    ({sessionData.totalQuestions - answeredCount} remaining)
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Complete & Grade Examination <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TheoryTestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      }
    >
      <TheoryTestContent />
    </Suspense>
  );
}
