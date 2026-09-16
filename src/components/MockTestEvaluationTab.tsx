"use client";

import React, { useState } from "react";
import { Application } from "@/lib/types";
import { MockTestAssessment } from "@/lib/operations-types";

interface MockTestEvaluationTabProps {
  candidates: Application[];
  adminPasscode: string;
  onOpenCertificate: (cand: Application) => void;
}

export default function MockTestEvaluationTab({
  candidates,
  adminPasscode,
  onOpenCertificate,
}: MockTestEvaluationTabProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || "");
  const [theoryScore, setTheoryScore] = useState<number>(42);
  const [parkingManeuvers, setParkingManeuvers] = useState<"Pass" | "Fail">("Pass");
  const [roadDrivingScore, setRoadDrivingScore] = useState<number>(44);
  const [examinerName, setExaminerName] = useState<string>("Lead Instructor");
  const [remarks, setRemarks] = useState<string>("Demonstrated great road awareness and smooth parallel parking.");

  const [testRecords, setTestRecords] = useState<MockTestAssessment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCand = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Calculate overall verdict
  const totalScore = Number(theoryScore) + Number(roadDrivingScore); // Max 100
  const isPassed = totalScore >= 70 && parkingManeuvers === "Pass";
  const verdict = isPassed ? "passed" : totalScore >= 50 ? "remedial" : "failed";

  const handleRecordTest = async () => {
    if (!selectedCand) return;
    setIsSubmitting(true);
    try {
      const newTest: MockTestAssessment = {
        id: "test_" + Date.now(),
        applicationId: selectedCand.id,
        candidateName: selectedCand.surname + " " + selectedCand.last_name,
        applicationNumber: selectedCand.application_number,
        phone: selectedCand.phone_number,
        electoralArea: selectedCand.electoral_area || "Takoradi",
        testDate: new Date().toISOString().split("T")[0],
        theoryScore: Number(theoryScore),
        parkingManeuvers,
        roadDrivingScore: Number(roadDrivingScore),
        overallVerdict: verdict,
        examinerName,
        remarks,
        isEligibleForCertificate: isPassed,
        created_at: new Date().toISOString(),
      };

      await fetch("/api/admin/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + adminPasscode,
        },
        body: JSON.stringify({
          action: "RECORD_MOCK_TEST",
          payload: newTest,
        }),
      });

      setTestRecords((prev) => [newTest, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      {/* Test Evaluation Form (5 Cols) */}
      <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span>📝 Record Mock & Road Test</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-black">
              DVLA Prep
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate candidate theory and practical driving competence
          </p>

          <div className="mt-4 space-y-3 text-xs">
            {/* Candidate Selector */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Select Candidate
              </label>
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.surname} {c.last_name} ({c.application_number})
                  </option>
                ))}
              </select>
            </div>

            {/* Theory Exam Score */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Theory Score (/50)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={theoryScore}
                  onChange={(e) => setTheoryScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Road Driving (/50)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={roadDrivingScore}
                  onChange={(e) => setRoadDrivingScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Parking & Yard Maneuvers */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Yard & Parking Maneuvers (Parallel / Hill Start)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setParkingManeuvers("Pass")}
                  className={"py-2 rounded-xl text-xs font-bold border transition-all " +
                    (parkingManeuvers === "Pass"
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200")
                  }
                >
                  ✓ Passed Maneuvers
                </button>
                <button
                  type="button"
                  onClick={() => setParkingManeuvers("Fail")}
                  className={"py-2 rounded-xl text-xs font-bold border transition-all " +
                    (parkingManeuvers === "Fail"
                      ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200")
                  }
                >
                  ✕ Failed Maneuvers
                </button>
              </div>
            </div>

            {/* Examiner & Remarks */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Examiner / Instructor Name
              </label>
              <input
                type="text"
                value={examinerName}
                onChange={(e) => setExaminerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Examiner Remarks & Assessment Notes
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Verdict Badge & Submit Button */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Score</span>
              <span className="text-base font-black text-slate-900">{totalScore} / 100</span>
            </div>
            <span className={"px-3 py-1 rounded-full text-xs font-black uppercase " +
              (verdict === "passed" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
               verdict === "remedial" ? "bg-amber-100 text-amber-800 border border-amber-300" :
               "bg-rose-100 text-rose-800 border border-rose-300")
            }>
              {verdict === "passed" ? "🟢 PASSED" : verdict === "remedial" ? "🟡 NEEDS REMEDIAL" : "🔴 FAILED"}
            </span>
          </div>

          <button
            onClick={handleRecordTest}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Recording Evaluation..." : "💾 Save Test Evaluation"}
          </button>
        </div>
      </div>

      {/* Recorded Evaluations History (7 Cols) */}
      <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-900">
            📊 Recent Test Evaluations ({testRecords.length})
          </h3>
          <input
            type="text"
            placeholder="🔍 Search evaluated students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 w-48"
          />
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {testRecords.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-xs">
              No test evaluations recorded yet today. Complete the form to record candidate results.
            </div>
          ) : (
            testRecords.map((t) => (
              <div key={t.id} className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{t.candidateName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{t.applicationNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                    <span>Theory: <strong>{t.theoryScore}/50</strong></span>
                    <span>•</span>
                    <span>Road Test: <strong>{t.roadDrivingScore}/50</strong></span>
                    <span>•</span>
                    <span>Parking: <strong>{t.parkingManeuvers}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 italic">"{t.remarks}"</p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={"px-2 py-0.5 rounded-full text-[10px] font-bold " +
                    (t.overallVerdict === "passed" ? "bg-emerald-100 text-emerald-800" :
                     t.overallVerdict === "remedial" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800")
                  }>
                    {t.overallVerdict.toUpperCase()}
                  </span>

                  {t.isEligibleForCertificate && (
                    <button
                      onClick={() => {
                        const targetCand = candidates.find((c) => c.id === t.applicationId);
                        if (targetCand) onOpenCertificate(targetCand);
                      }}
                      className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg shadow-2xs transition-all active:scale-95"
                    >
                      🎓 View Certificate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
