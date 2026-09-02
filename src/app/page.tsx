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

          <div className="pt-4">
            <a
              href="#application-form"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-brand-500/25"
            >
              Fill Application Form <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section id="application-form" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
