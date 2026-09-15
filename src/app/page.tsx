import Link from "next/link";
import ApplicationForm from "@/components/ApplicationForm";
import {
  Car,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Award,
  Users,
  Sparkles,
  ArrowDown,
  Clock,
  BookOpen,
  FileDown,
  Printer,
  FileText,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-16 sm:py-24">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white p-1">
              <img
                src="/logo.png"
                alt="KobbyDrive Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Official Sponsored Free Driving Initiative
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            Apply for the <br />
            <span className="bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Free Driving School Program
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Gain professional road safety knowledge, vehicle control mastery, and driver licensing support. Fully sponsored for eligible candidates in the community.
          </p>

          {/* Key Value Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 max-w-3xl mx-auto text-left">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur">
              <Award className="w-5 h-5 text-brand-400 mb-1" />
              <div className="text-sm font-bold text-white">100% Free Tuition</div>
              <div className="text-[11px] text-slate-400">Zero enrollment fee</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur">
              <BookOpen className="w-5 h-5 text-brand-400 mb-1" />
              <div className="text-sm font-bold text-white">Certified Instructors</div>
              <div className="text-[11px] text-slate-400">DVLA-aligned training</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur">
              <Clock className="w-5 h-5 text-brand-400 mb-1" />
              <div className="text-sm font-bold text-white">Flexible Schedules</div>
              <div className="text-[11px] text-slate-400">Weekend & weekday slots</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur">
              <ShieldCheck className="w-5 h-5 text-brand-400 mb-1" />
              <div className="text-sm font-bold text-white">Digital Certification</div>
              <div className="text-[11px] text-slate-400">Online progress tracking</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="#application-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-brand-500/25"
            >
              Fill Online Form <ArrowDown className="w-4 h-4" />
            </a>

            <Link
              href="/download-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-all shadow-md hover:border-slate-600"
            >
              <FileDown className="w-4 h-4 text-brand-400" /> Download PDF Form
            </Link>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section id="application-form" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Offline Form Notice Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Prefer to fill out a paper form by hand?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Download and print the official blank registration form to complete offline at your convenience.
              </p>
            </div>
          </div>

          <Link
            href="/download-form"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <FileDown className="w-4 h-4" /> Download Blank PDF Form
          </Link>
        </div>

        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full border border-brand-200">
            Public Registration Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Applicant Registration Form
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Please fill in all 14 required fields accurately. Once submitted, you will receive an official Application Number to track your progress.
          </p>
        </div>

        <ApplicationForm />
      </section>
    </div>
  );
}
