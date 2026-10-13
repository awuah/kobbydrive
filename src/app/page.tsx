import Link from "next/link";
import ApplicationForm from "@/components/ApplicationForm";
import NoticeModal from "@/components/NoticeModal";
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
  Search,
  ArrowRight,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Tv,
  Percent
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NoticeModal />
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
            <Link
              href="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-brand-500/25 group"
            >
              <Search className="w-4 h-4" /> Check Application Status <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <a
              href="#ecosystem-services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-all shadow-md hover:border-slate-600"
            >
              Explore Driving Programs <ArrowDown className="w-4 h-4 text-brand-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Ecosystem Hub */}
      <section id="ecosystem-services" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              KobbyDrive Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
              Explore Our Driving & Corporate Services
            </h2>
            <p className="text-sm text-slate-600">
              Beyond free beginner lessons, discover our professional driver recruitment, retraining academy, exclusive club perks, and in-simulator ad network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Driver Recruitment */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Driver Recruitment Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Private companies, corporate fleets, and families can recruit certified, background-checked, and simulator-vetted drivers for a transparent fee.
                </p>
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-4">
                  From GH₵ 150 Placement Fee
                </div>
              </div>
              <Link
                href="/recruitment"
                className="inline-flex items-center justify-between text-xs font-bold text-slate-900 hover:text-brand-600 pt-3 border-t border-slate-100"
              >
                <span>Hire Certified Drivers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 2. Drivers Club */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Drivers Club</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Exclusive members-only benefits offering instant digital passes with discounts on Goil fuel, servicing at Japan Motors, insurance rebates, and 24/7 rescue.
                </p>
                <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block mb-4">
                  Up to 15% Partner Discounts
                </div>
              </div>
              <Link
                href="/drivers-club"
                className="inline-flex items-center justify-between text-xs font-bold text-slate-900 hover:text-brand-600 pt-3 border-t border-slate-100"
              >
                <span>Access Member Pass</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3. Refresher Courses */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Driver Refresher Courses</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Retraining modules for experienced and corporate drivers covering defensive driving, night navigation, commercial fleet protocols, and heavy goods vehicles.
                </p>
                <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md inline-block mb-4">
                  6 DVLA-Aligned Modules
                </div>
              </div>
              <Link
                href="/refresher-courses"
                className="inline-flex items-center justify-between text-xs font-bold text-slate-900 hover:text-brand-600 pt-3 border-t border-slate-100"
              >
                <span>Browse Refresher Syllabus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4. Merchandise Store */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Merchandise Store</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Shop official KobbyDrive branded polos, DVLA magnetic learner plates, high-visibility reflective vests, first aid kits, and official Highway Code books.
                </p>
                <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-4">
                  Mobile Money & Card Accepted
                </div>
              </div>
              <Link
                href="/store"
                className="inline-flex items-center justify-between text-xs font-bold text-slate-900 hover:text-brand-600 pt-3 border-t border-slate-100"
              >
                <span>Shop Official Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 5. Simulator Ad Space */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Simulator Ad Network</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Place digital ads on 3D virtual highway billboards and in-cockpit GPS navigation units inside our simulators. Reach 1,400+ focused drivers with 0% ad-blockers.
                </p>
                <div className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md inline-block mb-4">
                  From GH₵ 450 / month
                </div>
              </div>
              <Link
                href="/simulator-ads"
                className="inline-flex items-center justify-between text-xs font-bold text-slate-900 hover:text-brand-600 pt-3 border-t border-slate-100"
              >
                <span>Preview 3D Ad Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 6. Status Tracker & Admin */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 text-brand-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Application Tracking & Admin</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Enrolled students can track their verification and training status. Administrators can review applications, manage cohorts, and inspect gender demographic breakdowns.
                </p>
                <div className="text-[11px] font-semibold text-brand-300 bg-white/10 px-2.5 py-1 rounded-md inline-block mb-4">
                  Instant Reference Lookup
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-700">
                <Link
                  href="/track"
                  className="flex-1 py-2 px-3 text-center text-xs font-bold text-slate-950 bg-brand-400 rounded-lg hover:bg-brand-300 transition-colors"
                >
                  Track Status
                </Link>
                <Link
                  href="/admin"
                  className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Notice / Form Section */}
      <section id="application-notice" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Public Registration Notice
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Applications Currently Paused
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            We are currently reviewing applications. If you have already registered, you can track the status of your enrollment.
          </p>
        </div>

        <ApplicationForm />
      </section>
    </div>
  );
}
