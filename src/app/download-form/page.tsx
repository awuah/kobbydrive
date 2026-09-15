"use client";

import React from "react";
import Link from "next/link";
import { Printer, Download, ArrowLeft, ShieldCheck, CheckSquare, Square } from "lucide-react";

export default function DownloadFormPage() {
  const handlePrint = () => {
    window.print();
  };

  const takoradiAreas = [
    "1. Amanful West",
    "2. Amanful East",
    "3. Beach Road",
    "4. Essikafo Ambitem No. 1",
    "5. Essikafo Ambitem No. 2",
    "6. Chapel Hill",
    "7. Railway & Harbour",
    "8. New-Takoradi Lower",
    "9. Poasi - Upper New-Takoradi",
    "10. Airforce",
    "11. Old Adra",
    "12. Cassava Farm",
    "13. Zenith",
    "14. Airport Ridge",
    "15. Presby",
    "16. Other",
  ];

  const trainingPurposes = [
    { letter: "A", title: "Personal", desc: "Private driving for daily commutes and family use" },
    { letter: "B", title: "Commercial Driver", desc: "Taxi, ride-hailing, trotro, bus, or haulage transport" },
    { letter: "C", title: "Agricultural", desc: "Farm machinery, tractors, and agricultural logistics" },
    { letter: "D", title: "Private", desc: "Dedicated personal / corporate chauffeur and executive transport" },
    { letter: "E", title: "Equipment Handling", desc: "Forklifts, earthmovers, construction, and heavy machinery" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 text-slate-900 print:bg-white print:p-0 print:m-0">
      {/* Action Toolbar (Hidden during print) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 no-print">
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Portal
            </Link>
            <div>
              <h2 className="text-sm font-bold text-white">Official Printable Application Form</h2>
              <p className="text-xs text-slate-400">Print directly or save as PDF via your browser print dialog</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* A4 Printable Document Container */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-xl rounded-2xl border border-slate-200 print:shadow-none print:border-none print:p-4 print:rounded-none print:max-w-none text-xs">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-300 bg-white p-1 shrink-0">
              <img
                src="/logo.png"
                alt="Kobby Free Driving School Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                Official Registration Form
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Kobby Free Driving School
              </h1>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">
                Community Road Safety & Free Driver Licensing Initiative • Takoradi Constituency
              </p>
            </div>
          </div>

          {/* Photo Box */}
          <div className="w-28 h-32 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center text-center p-2 shrink-0 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-600 uppercase leading-tight">
              Affix Passport Photo Here
            </span>
            <span className="text-[9px] text-slate-400 mt-1">(Recent photo, plain background)</span>
          </div>
        </div>

        {/* Instructions Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
          <p className="text-[11px] text-slate-700 leading-snug">
            <strong>INSTRUCTIONS:</strong> Complete this form in <strong>BLOCK LETTERS</strong> using a black or blue ink pen. Ensure all information provided is accurate and verifiable. Return the completed form to the designated community coordinator or registry office.
          </p>
        </div>

        {/* Section 1: Personal & Identification Profile */}
        <div className="mb-6 space-y-3">
          <div className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded text-xs uppercase tracking-wider">
            1. Personal & Identification Profile
          </div>

          <div className="grid grid-cols-3 gap-4 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Title:</span>
              <div className="border-b border-slate-400 h-7 flex items-center text-slate-600 text-[11px] gap-2">
                <span>[ ] Mr</span> <span>[ ] Mrs</span> <span>[ ] Miss</span> <span>[ ] Ms</span>
              </div>
            </div>

            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">1. Surname (Family Name):</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">2. First / Other Names:</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">3. Gender:</span>
              <div className="border-b border-slate-400 h-7 flex items-center text-slate-600 text-[11px] gap-3">
                <span>[ ] Male</span> <span>[ ] Female</span> <span>[ ] Other</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">7. Date of Birth (DD/MM/YYYY):</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">8. Place of Birth:</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">11. Nationality:</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">5. National ID Type:</span>
              <div className="border-b border-slate-400 h-7 text-[10px] flex items-center text-slate-600 gap-1.5">
                <span>[ ] Ghana Card</span> <span>[ ] Voter</span> <span>[ ] Other</span>
              </div>
            </div>

            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">6. National ID Number:</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Residential Details */}
        <div className="mb-6 space-y-3">
          <div className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded text-xs uppercase tracking-wider">
            2. Contact & Residential Details
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">13. Contact Phone Number (WhatsApp / Voice):</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">12. Email Address:</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">10. House No. / Digital Address:</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">9. Postal Address (Optional):</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>

            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">House Address / Street Name / Locality:</span>
              <div className="border-b border-slate-400 h-7"></div>
            </div>
          </div>
        </div>

        {/* Section 3: Takoradi Constituency Voting / Living Area */}
        <div className="mb-6 space-y-3">
          <div className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded text-xs uppercase tracking-wider">
            3. Where do you live or vote in Takoradi Constituency? (Tick One)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {takoradiAreas.map((area, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 border border-slate-200 rounded text-[11px]">
                <div className="w-3.5 h-3.5 border border-slate-400 rounded-sm shrink-0"></div>
                <span className="truncate">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Driver Training Objective */}
        <div className="mb-6 space-y-3">
          <div className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded text-xs uppercase tracking-wider">
            4. What will you use the driver training for? (Tick One)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {trainingPurposes.map((opt) => (
              <div key={opt.letter} className="flex items-start gap-2.5 p-2 border border-slate-200 rounded">
                <div className="w-4 h-4 border border-slate-400 rounded-sm shrink-0 mt-0.5"></div>
                <div>
                  <div className="font-bold text-[11px] text-slate-900">
                    {opt.letter}. {opt.title}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Declaration & Signature */}
        <div className="mb-6 space-y-3 border-t-2 border-slate-900 pt-4">
          <div className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded text-xs uppercase tracking-wider">
            5. Candidate Declaration & Signature
          </div>

          <p className="text-[10px] text-slate-600 leading-relaxed pt-1">
            I hereby declare that the particulars provided in this application form are true, correct, and complete to the best of my knowledge and belief. I agree to abide by all the rules, attendance requirements, and road safety regulations set forth by the Kobby Free Driving School Program.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Applicant Signature / Thumbprint:</span>
              <div className="border-b-2 border-slate-900 h-10"></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date (DD/MM/YYYY):</span>
              <div className="border-b-2 border-slate-900 h-10"></div>
            </div>
          </div>
        </div>

        {/* Official Use Only Box */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 mt-6">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
            FOR OFFICIAL USE ONLY (PROGRAM REGISTRAR / ENROLLMENT COMMITTEE)
          </span>
          <div className="grid grid-cols-3 gap-4 text-[10px]">
            <div>
              <span className="text-slate-500 block">Assigned Ref Number:</span>
              <div className="border-b border-slate-300 h-6"></div>
            </div>
            <div>
              <span className="text-slate-500 block">Enrollment Status:</span>
              <div className="border-b border-slate-300 h-6">[ ] Approved [ ] Waitlist</div>
            </div>
            <div>
              <span className="text-slate-500 block">Officer Signature & Stamp:</span>
              <div className="border-b border-slate-300 h-6"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[9px] text-slate-400">
          Kobby Free Driving School Portal: https://kobbydrive.vercel.app • Official Registration Record
        </div>
      </div>
    </div>
  );
}