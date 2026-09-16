"use client";

import React from "react";
import { Application } from "@/lib/types";

interface ProvisionalCertificateModalProps {
  candidate: Application;
  onClose: () => void;
}

export default function ProvisionalCertificateModal({
  candidate,
  onClose,
}: ProvisionalCertificateModalProps) {
  const certNumber = "KBD-CERT-2026-" + candidate.application_number.replace(/[^0-9]/g, "").slice(-4);
  const issueDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Actions Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <span className="font-bold text-xs text-amber-300">
            🎓 Official Provisional Driver Completion Certificate
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
            >
              🖨️ Print / Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-slate-100">
          <div className="bg-white border-8 border-double border-amber-600/70 rounded-2xl p-8 sm:p-12 max-w-3xl w-full shadow-lg text-center relative font-serif">
            {/* Security Border Watermark */}
            <div className="absolute inset-4 border border-amber-300/40 pointer-events-none rounded-xl" />

            {/* Header / Crest */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-2xl font-black text-amber-900 mb-2">
                🇬🇭
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider uppercase font-sans">
                KOBBY FREE DRIVING SCHOOL
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-sans font-semibold">
                Takoradi Constituency Youth Skills & Empowerment Initiative
              </p>
            </div>

            {/* Title */}
            <div className="my-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-4 py-1 rounded-full font-sans">
                PROVISIONAL CERTIFICATE OF COMPLETION
              </span>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                Certificate ID: <strong>{certNumber}</strong>
              </p>
            </div>

            {/* Body */}
            <div className="my-6 space-y-4 text-slate-700 leading-relaxed font-sans">
              <p className="text-xs italic text-slate-500">This is to certify that</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 underline decoration-amber-500 decoration-2 underline-offset-4">
                {candidate.title || ""} {candidate.surname} {candidate.last_name}
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Has successfully completed the intensive <strong>3-Week Comprehensive Practical & Theory Driver Training Program</strong> (18 Field Sessions, Highway Code & Vehicle Yard Maneuvers) and passed all mock examinations.
              </p>
            </div>

            {/* Details Grid */}
            <div className="my-6 grid grid-cols-3 gap-3 p-3 bg-amber-50/40 rounded-xl border border-amber-200/60 text-xs font-sans text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Ref Number</span>
                <span className="font-mono font-bold text-slate-800">{candidate.application_number}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Electoral Area</span>
                <span className="font-bold text-slate-800">{candidate.electoral_area || "Takoradi Central"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Date</span>
                <span className="font-bold text-slate-800">{issueDate}</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center font-sans">
              <div>
                <div className="font-script text-lg text-slate-800 italic">Hon. Kobby Okyere Darko-Mensah</div>
                <div className="w-36 h-0.5 bg-slate-400 mx-auto mt-1" />
                <span className="text-[11px] text-slate-500 uppercase font-bold mt-1 block">
                  Member of Parliament / Patron
                </span>
              </div>

              <div>
                <div className="font-script text-lg text-slate-800 italic">Chief Driving Instructor</div>
                <div className="w-36 h-0.5 bg-slate-400 mx-auto mt-1" />
                <span className="text-[11px] text-slate-500 uppercase font-bold mt-1 block">
                  Head of Training & DVLA Liaison
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
