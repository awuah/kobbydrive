"use client";

import React, { useState, useEffect } from "react";
import { Application } from "@/lib/types";
import TraineeAttendanceTab from "./TraineeAttendanceTab";
import MockTestEvaluationTab from "./MockTestEvaluationTab";
import FuelVehicleLogTab from "./FuelVehicleLogTab";
import InstructorAttendanceTab from "./InstructorAttendanceTab";
import ProvisionalCertificateModal from "./ProvisionalCertificateModal";

interface OperationsDashboardModalProps {
  onClose: () => void;
  adminPasscode: string;
}

export default function OperationsDashboardModal({
  onClose,
  adminPasscode,
}: OperationsDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<"attendance" | "mock_tests" | "fuel_logs" | "instructors">("attendance");
  const [candidates, setCandidates] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [certCandidate, setCertCandidate] = useState<Application | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/operations", {
          headers: { Authorization: "Bearer " + adminPasscode },
        });
        const data = await res.json();
        if (data.success) {
          setCandidates(data.candidates || []);
        }
      } catch (err) {
        console.error("Operations fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [adminPasscode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-100 rounded-3xl shadow-2xl border border-slate-300 w-full max-w-[1300px] h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 text-xl font-black shadow-lg shadow-amber-500/20">
              🚘
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Training Operations & Field Management</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Attendance • Tests • Fuel • Certs
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Daily field operations, driver training attendance, DVLA mock tests & fuel logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Navigation */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 flex-wrap">
              <button
                onClick={() => setActiveTab("attendance")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                  (activeTab === "attendance" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white")
                }
              >
                📅 Trainee Attendance
              </button>
              <button
                onClick={() => setActiveTab("mock_tests")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                  (activeTab === "mock_tests" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white")
                }
              >
                📝 Mock Tests & Exams
              </button>
              <button
                onClick={() => setActiveTab("fuel_logs")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                  (activeTab === "fuel_logs" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white")
                }
              >
                ⛽ Fuel & Vehicle Log
              </button>
              <button
                onClick={() => setActiveTab("instructors")}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
                  (activeTab === "instructors" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white")
                }
              >
                👨‍🏫 Instructors
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
        <div className="flex-1 p-3 sm:p-5 overflow-hidden">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span>Loading operational candidates...</span>
            </div>
          ) : activeTab === "attendance" ? (
            <TraineeAttendanceTab candidates={candidates} adminPasscode={adminPasscode} />
          ) : activeTab === "mock_tests" ? (
            <MockTestEvaluationTab
              candidates={candidates}
              adminPasscode={adminPasscode}
              onOpenCertificate={(cand) => setCertCandidate(cand)}
            />
          ) : activeTab === "fuel_logs" ? (
            <FuelVehicleLogTab adminPasscode={adminPasscode} />
          ) : (
            <InstructorAttendanceTab />
          )}
        </div>

        {/* Certificate Modal */}
        {certCandidate && (
          <ProvisionalCertificateModal
            candidate={certCandidate}
            onClose={() => setCertCandidate(null)}
          />
        )}
      </div>
    </div>
  );
}
