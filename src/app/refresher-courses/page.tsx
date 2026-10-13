"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  Send,
  Loader2,
  X,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface RefresherCourse {
  id: string;
  title: string;
  duration: string;
  format: string;
  badge: string;
  description: string;
  topics: string[];
  audience: string;
  certificate: string;
  tagColor: string;
}

const COURSES: RefresherCourse[] = [
  {
    id: "defensive-driving",
    title: "Defensive Driving & Hazard Perception Masterclass",
    duration: "2 Days (Weekend Intensive)",
    format: "Simulator Lab + Dual-Control Road Run",
    badge: "Flagship Program",
    description: "Master pre-collision recognition, situational spatial awareness, and evasive vehicle maneuvers under simulated and real road pressures.",
    topics: [
      "Hazard identification scanning techniques",
      "Emergency braking without skidding (ABS vs Non-ABS)",
      "Adverse weather & heavy rain handling",
      "Blind-spot awareness & rear collision evasion",
    ],
    audience: "All licensed drivers seeking advanced defensive road skills.",
    certificate: "DVLA-Endorsed Defensive Driving Certificate",
    tagColor: "bg-brand-50 text-brand-700 border-brand-200",
  },
  {
    id: "night-highway",
    title: "Night Driving, Rain & Highway Speed Control",
    duration: "1 Day (Afternoon / Evening Session)",
    format: "3D Night Simulator + Dual-Carriageway Run",
    badge: "High Demand",
    description: "Designed for drivers uncomfortable with headlight glare, unlit intercity highways, rain aquaplaning, and sudden road obstacles.",
    topics: [
      "Counteracting high-beam headlight glare",
      "Aquaplaning prevention on flooded asphalt",
      "Safe overtaking techniques on single-lane roads",
      "Driver fatigue management on long journeys",
    ],
    audience: "Commuters, intercity travelers, and nervous night drivers.",
    certificate: "Advanced Highway Road Safety Endorsement",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "commercial-fleet",
    title: "Commercial Passenger Transport & Taxi Road Etiquette",
    duration: "3 Days (Flexible Slots)",
    format: "Practical Coaching & Customer Service Seminar",
    badge: "Fleet Standard",
    description: "Comprehensive retraining for taxi, ride-hailing, trotro, and corporate bus drivers focusing on safety, legal compliance, and customer care.",
    topics: [
      "Passenger safety protocols & gentle braking",
      "Road traffic legal liabilities & passenger insurance",
      "De-escalating road rage & conflict resolution",
      "Preventive vehicle walkaround inspections",
    ],
    audience: "Commercial drivers, taxi associations, and fleet chauffeurs.",
    certificate: "Certified Commercial Driver Safety Credential",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "heavy-goods",
    title: "Heavy Goods (HGV) & Articulated Equipment Maneuvering",
    duration: "4 Days (Intensive Track)",
    format: "Harbour / Logistics Yard Practical + Simulator",
    badge: "Industrial Specialist",
    description: "Refresher training on blind-spot elimination, reversing articulated trailers, payload weight distribution, and steep incline gear selection.",
    topics: [
      "Trailer coupling, hitching & air-brake systems",
      "Tight-space turning angles & tail-swing clearance",
      "Axle weight balance & load security",
      "Port & container terminal safety protocols",
    ],
    audience: "Tipper truck, haulage, tanker, and heavy machinery operators.",
    certificate: "HGV Professional Operator Endorsement",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    id: "eco-driving",
    title: "Eco-Driving & Fuel Economy Optimization",
    duration: "1 Day (Theory + Telemetry Tracking)",
    format: "Simulator Telemetry Analysis + Live Run",
    badge: "Cost Reduction",
    description: "Learn precise accelerator modulation, anticipatory braking, and gear shift timings to slash fleet and private vehicle fuel bills by up to 22%.",
    topics: [
      "Momentum preservation & predictive road reading",
      "Gear ratio optimization & idle time reduction",
      "Tyre pressure & aerodynamic drag impact",
      "Engine telemetry feedback review",
    ],
    audience: "Corporate fleet managers, logistics drivers, and everyday car owners.",
    certificate: "Eco-Driver Green Certification",
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    id: "dvla-regulations",
    title: "2026 Ghana Road Traffic Regulations & Penalty System Review",
    duration: "1 Day (Half-Day Seminar)",
    format: "Classroom / Digital Interactive Workshop",
    badge: "Legal Compliance",
    description: "Stay ahead of newly updated 2026 DVLA road traffic act amendments, digital speeding cameras, penalty point regulations, and vehicle document validity.",
    topics: [
      "2026 Traffic Act statutory updates & revised fines",
      "Digital speed enforcement cameras & radar zones",
      "Roadworthiness inspection standards",
      "Motor insurance and digital driver's license validation",
    ],
    audience: "Fleet managers, transport officers, and all licensed drivers.",
    certificate: "Road Traffic Law Compliance Certificate",
    tagColor: "bg-sky-50 text-sky-800 border-sky-200",
  },
];

export default function RefresherCoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<RefresherCourse | null>(null);

  // Enrollment Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [courseModule, setCourseModule] = useState(COURSES[0].title);
  const [schedulePreference, setSchedulePreference] = useState("Weekend (Saturday & Sunday)");
  const [experienceLevel, setExperienceLevel] = useState("1 - 3 Years of Driving");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [enrollmentRef, setEnrollmentRef] = useState<string | null>(null);

  const handleOpenEnrollment = (course?: RefresherCourse) => {
    if (course) {
      setSelectedCourse(course);
      setCourseModule(course.title);
    } else {
      setSelectedCourse(null);
    }
    setEnrollmentRef(null);
    setIsModalOpen(true);
  };

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/courses/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          licenseNumber,
          courseModule,
          schedulePreference,
          experienceLevel,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEnrollmentRef(data.enrollmentRef);
      } else {
        alert(data.error || "Failed to register for refresher course.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold tracking-wide">
              <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
              Driver Upskilling & Retraining Academy
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Driver Refresher & Retraining Courses
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Renew your road confidence, sharpen defensive driving skills, and update yourself on newly amended road traffic regulations. Tailored modular programs combining cutting-edge simulator practice and on-road dual-control coaching.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleOpenEnrollment()}
                className="px-6 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                Register for a Course
              </button>
              <a
                href="#courses-catalog"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Explore Modules ({COURSES.length})
              </a>
            </div>
          </div>
        </div>

        {/* Why Take a Refresher Course */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Break Unsafe Driving Habits</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Years on the road naturally create complacency. Our DVLA-certified instructors identify blind-spots, improper hand positions, and braking delays before accidents happen.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Master Hazard Perception</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Experience simulated pedestrian near-misses, sudden motorcycle swerves, and heavy torrential downpours in our risk-free driving simulator cockpit before testing on live roads.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Official Endorsed Certification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive a verifiable KobbyDrive Retraining Certificate that boosts employment prospects for corporate chauffeur and commercial transport positions.
            </p>
          </div>
        </div>

        {/* Course Catalog Grid */}
        <div id="courses-catalog" className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Curriculum Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Available Refresher Modules
            </h2>
            <p className="text-sm text-slate-500">
              Select a specialized module based on your driving profile and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${course.tagColor}`}>
                      {course.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{course.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Core Syllabus Topics:
                    </span>
                    <ul className="space-y-1.5 text-slate-700">
                      {course.topics.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="text-[11px] text-slate-500">
                      <strong>Format:</strong> {course.format}
                    </div>
                    <div className="text-[11px] text-teal-800 font-bold">
                      <strong>Award:</strong> {course.certificate}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEnrollment(course)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  Enroll in this Module <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="h-2 bg-gradient-to-r from-teal-500 to-brand-500" />

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              {enrollmentRef ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Enrollment Submitted!</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    Your refresher course enrollment has been registered. You will receive an SMS confirmation with your scheduled start date and instructor assignment.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xl font-black text-teal-800">
                    {enrollmentRef}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedCourse ? selectedCourse.title : "Refresher Course Enrollment"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fill out your details to join the upcoming training batch.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitEnrollment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Richmond Kofi Ansah"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (SMS Alert) *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0244 567 890"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="richmond@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Existing Driver's License No.</label>
                        <input
                          type="text"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="e.g. WR-1234567-20"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
                        <select
                          value={experienceLevel}
                          onChange={(e) => setExperienceLevel(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="Novice (Under 1 Year)">Novice (Under 1 Year)</option>
                          <option value="1 - 3 Years of Driving">1 - 3 Years of Driving</option>
                          <option value="3 - 7 Years of Driving">3 - 7 Years of Driving</option>
                          <option value="Senior Driver (7+ Years)">Senior Driver (7+ Years)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Selected Refresher Module</label>
                      <select
                        value={courseModule}
                        onChange={(e) => setCourseModule(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-teal-500"
                      >
                        {COURSES.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Training Schedule</label>
                      <select
                        value={schedulePreference}
                        onChange={(e) => setSchedulePreference(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Weekend (Saturday & Sunday)">Weekend (Saturday & Sunday)</option>
                        <option value="Weekday Morning (8am - 12pm)">Weekday Morning (8am - 12pm)</option>
                        <option value="Weekday Evening (4pm - 7pm)">Weekday Evening (4pm - 7pm)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Notes or Areas to Improve</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Need to build confidence with manual hill-starts and night driving..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Enrolling...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Course Registration
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
