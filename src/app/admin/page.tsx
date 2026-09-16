"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Application, ApplicationStatus, DashboardStats } from "@/lib/types";
import { formatApplicationStatus, formatDate, formatDateTime, formatTrainingScheduleBadge, parseTrainingDetails } from "@/lib/utils";
import AdminStats from "@/components/AdminStats";
import ApplicationDetailsModal from "@/components/ApplicationDetailsModal";
import AdminActivityLogs from "@/components/AdminActivityLogs";
import RejectionReasonModal from "@/components/RejectionReasonModal";
import ElectoralAreaSummaryModal from "@/components/ElectoralAreaSummaryModal";
import ScheduleManagementModal from "@/components/ScheduleManagementModal";
import OperationsDashboardModal from "@/components/OperationsDashboardModal";
import { isSuperAdminPasscode, isValidAdminPasscode, getAdminIdentity, AdminIdentity } from "@/lib/auth";
import {
  Shield,
  Search,
  RefreshCw,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  LogOut,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Crown,
  User,
  History,
  LayoutDashboard,
  BarChart3,
  Clock,
  Calendar,
  Car,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminPasscode, setAdminPasscode] = useState<string>("");
  const [adminIdentity, setAdminIdentity] = useState<AdminIdentity | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Tabs for Superadmin ('applications' | 'activity_logs')
  const [activeTab, setActiveTab] = useState<"applications" | "activity_logs">("applications");

  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    in_training: 0,
    completed: 0,
    rejected: 0,
    todayCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [scheduleFilter, setScheduleFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Pagination state (default: 50 records per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [showBatchRejectModal, setShowBatchRejectModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOperationsModal, setShowOperationsModal] = useState(false);

  // Authentication check & session validation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("kbdr_admin_authenticated");
      const pass = localStorage.getItem("kbdr_admin_pass") || "";
      const clean = pass.replace(/[\s-]/g, "").toLowerCase();

      // Immediate eviction if legacy admin2026 or invalid passcode
      if (
        auth !== "true" ||
        !pass ||
        clean === "admin2026" ||
        !isValidAdminPasscode(pass)
      ) {
        localStorage.removeItem("kbdr_admin_authenticated");
        localStorage.removeItem("kbdr_admin_pass");
        localStorage.removeItem("kbdr_admin_role");
        document.cookie = "kbdr_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/admin/login");
        return;
      }

      setAdminPasscode(pass);
      const identity = getAdminIdentity(pass);
      setAdminIdentity(identity);
      setIsSuperAdmin(isSuperAdminPasscode(pass));
      setIsAuthenticated(true);
    }
  }, [router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());

      const res = await fetch(`/api/admin?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${adminPasscode}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("kbdr_admin_authenticated");
        localStorage.removeItem("kbdr_admin_pass");
        localStorage.removeItem("kbdr_admin_role");
        document.cookie = "kbdr_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/admin/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setApplications(data.data || []);
        setTotalCount(data.total ?? (data.data?.length || 0));
        setTotalPages(data.totalPages || 1);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage, pageSize, adminPasscode, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kbdr_admin_authenticated");
      localStorage.removeItem("kbdr_admin_pass");
      document.cookie = "kbdr_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    router.push("/admin/login");
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: ApplicationStatus,
    notes: string
  ) => {
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminPasscode}`,
      },
      body: JSON.stringify({ id, status: newStatus, admin_notes: notes }),
    });

    if (res.status === 401 || res.status === 403) {
      handleLogout();
      return;
    }

    const data = await res.json();
    if (data.success) {
      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus, admin_notes: notes, updated_at: new Date().toISOString() } : app
        )
      );
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication((prev) =>
          prev ? { ...prev, status: newStatus, admin_notes: notes } : null
        );
      }
      loadData();
    }
  };

  const handleBatchStatus = async (status: ApplicationStatus, notes?: string) => {
    if (selectedIds.length === 0) return;
    if (status === "rejected" && !notes) {
      setShowBatchRejectModal(true);
      return;
    }

    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPasscode}`,
        },
        body: JSON.stringify({ batchIds: selectedIds, status, admin_notes: notes }),
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSelectedIds([]);
        setShowBatchRejectModal(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBatchLoading(false);
    }
  };

  const handleBatchAssignSchedule = async (schedule: string) => {
    if (selectedIds.length === 0) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPasscode}`,
        },
        body: JSON.stringify({ batchIds: selectedIds, training_schedule: schedule }),
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSelectedIds([]);
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBatchLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export to CSV (fetches full matching set)
  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("limit", "all");

      const res = await fetch(`/api/admin?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${adminPasscode}`,
        },
      });
      const data = await res.json();
      const exportList: Application[] = data.success ? data.data : applications;

      if (!exportList || exportList.length === 0) return;

      // Log export action
      fetch("/api/admin/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPasscode}`,
        },
        body: JSON.stringify({
          action: "EXPORT_CSV",
          notes: `Exported ${exportList.length} applicant records to CSV.`,
        }),
      }).catch((e) => console.warn("Export log error:", e));

      const headers = [
        "Application Number",
        "Title",
        "Surname",
        "Last Name",
        "Gender",
        "ID Type",
        "ID Number",
        "Date of Birth",
        "Place of Birth",
        "Nationality",
        "Phone Number",
        "Email",
        "Training Purpose",
        "Preferred Training Schedule",
        "Takoradi Electoral Area",
        "House No",
        "House Address",
        "Postal Address",
        "Status",
        "Admin Notes",
        "Created At",
      ];

      const rows = exportList.map((app) => {
        const details = parseTrainingDetails(app.training_purpose);
        const purpose = app.training_schedule ? app.training_purpose : details.purpose;
        const schedule = app.training_schedule || details.schedule || "unscheduled";

        return [
          `"${app.application_number}"`,
          `"${app.title}"`,
          `"${app.surname.replace(/"/g, '""')}"`,
          `"${app.last_name.replace(/"/g, '""')}"`,
          `"${app.gender}"`,
          `"${app.id_type}"`,
          `"${app.id_number}"`,
          `"${app.date_of_birth}"`,
          `"${app.place_of_birth.replace(/"/g, '""')}"`,
          `"${app.nationality}"`,
          `"${app.phone_number}"`,
          `"${app.email}"`,
          `"${(purpose || "Personal").replace(/"/g, '""')}"`,
          `"${schedule.replace(/"/g, '""')}"`,
          `"${(app.electoral_area || "Amanful West").replace(/"/g, '""')}"`,
          `"${(app.house_number || "").replace(/"/g, '""')}"`,
          `"${app.house_address.replace(/"/g, '""')}"`,
          `"${(app.postal_address || "").replace(/"/g, '""')}"`,
          `"${app.status}"`,
          `"${(app.admin_notes || "").replace(/"/g, '""')}"`,
          `"${app.created_at}"`,
        ];
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `kobbydrive_applications_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV export error:", err);
    }
  };

  // Filter applications by client-side filters if needed
  const filteredApplications = applications.filter((app) => {
    if (genderFilter !== "all" && app.gender !== genderFilter) return false;
    if (scheduleFilter !== "all") {
      const details = parseTrainingDetails(app.training_purpose);
      const appSched = (app.training_schedule || details.schedule || "unscheduled").toLowerCase();
      if (scheduleFilter === "unscheduled") {
        if (appSched !== "unscheduled") return false;
      } else {
        if (!appSched.includes(scheduleFilter.toLowerCase())) return false;
      }
    }
    return true;
  });

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <Shield className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Admin Monitoring Dashboard
            </h1>

            {/* Admin identity badge */}
            {adminIdentity && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isSuperAdmin
                    ? "bg-amber-400 text-slate-950"
                    : "bg-brand-500/20 text-brand-300 border border-brand-400/30"
                }`}
              >
                {isSuperAdmin ? <Crown className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                {adminIdentity.name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Free Driving School Program • Real-time Application Tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tab Switcher - Strictly visible only to Superadmin */}
          {isSuperAdmin && (
            <div className="p-1 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-1 mr-1">
              <button
                onClick={() => setActiveTab("applications")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "applications"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Applications
              </button>

              <button
                onClick={() => setActiveTab("activity_logs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "activity_logs"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <History className="w-3.5 h-3.5" /> Superadmin Audit Logs
              </button>
            </div>
          )}

          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>

          <button
            onClick={() => setShowSummaryModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 border border-brand-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-brand-400" /> Summary Report
          </button>

          <button
            onClick={() => setShowOperationsModal(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20 cursor-pointer active:scale-95"
          >
            <Car className="w-3.5 h-3.5 text-purple-200" /> Operations & Testing
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-950" /> Schedule Management
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Superadmin Tab Content Switcher */}
      {isSuperAdmin && activeTab === "activity_logs" ? (
        <AdminActivityLogs passcode={adminPasscode} />
      ) : (
        <>

      {/* KPI Stats Cards */}
      <AdminStats
        stats={stats}
        onFilterStatus={(status) => setStatusFilter(status)}
        activeStatus={statusFilter}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, phone, email, or ref..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="in_training">In Training</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Schedules</option>
              <option value="Early morning">🌅 Early morning (6am - 10am)</option>
              <option value="Mid morning">☀️ Mid morning (10am - 2pm)</option>
              <option value="Late afternoon">🌇 Late afternoon (2pm - 6pm)</option>
              <option value="unscheduled">⏳ Unscheduled</option>
            </select>
          </div>
        </div>

        {/* Batch Actions Toolbar (if any selected) */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-brand-900">
              ⚡ {selectedIds.length} candidate(s) selected
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBatchAssignSchedule(e.target.value);
                    e.target.value = "";
                  }
                }}
                disabled={batchLoading}
                className="px-3 py-1.5 rounded-lg bg-white border border-brand-300 text-slate-800 font-semibold shadow-xs focus:ring-2 focus:ring-brand-500 text-xs cursor-pointer"
              >
                <option value="">📅 Assign Schedule ▾</option>
                <option value="Early morning 6am to 10am">🌅 Early morning (6am - 10am)</option>
                <option value="Mid morning 10am to 2pm">☀️ Mid morning (10am - 2pm)</option>
                <option value="Late afternoon 2pm to 6pm">🌇 Late afternoon (2pm - 6pm)</option>
                <option value="unscheduled">⏳ Mark Unscheduled</option>
              </select>

              <button
                onClick={() => handleBatchStatus("in_training")}
                disabled={batchLoading}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors cursor-pointer"
              >
                Set In Training
              </button>
              <button
                onClick={() => handleBatchStatus("approved")}
                disabled={batchLoading}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer"
              >
                Approve Selected
              </button>
              <button
                onClick={() => handleBatchStatus("rejected")}
                disabled={batchLoading}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors cursor-pointer"
              >
                Reject Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredApplications.length > 0 &&
                      selectedIds.length === filteredApplications.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </th>
                <th className="p-4">Reference</th>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">Gender / Age</th>
                <th className="p-4">ID Details</th>
                <th className="p-4">Phone / Email</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => {
                  const statusInfo = formatApplicationStatus(app.status);
                  const isSelected = selectedIds.includes(app.id);

                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-brand-50/40" : ""
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(app.id)}
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                      </td>

                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {app.application_number}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {app.passport_photo ? (
                            <div className="w-9 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-xs">
                              <img
                                src={app.passport_photo}
                                alt="Applicant Photo"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 text-[10px] font-bold">
                              KBD
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900">
                              {app.title} {app.surname} {app.last_name}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-slate-400">{app.nationality}</span>
                              <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200">
                                {app.training_purpose || "Personal"}
                              </span>
                              {(() => {
                                const details = parseTrainingDetails(app.training_purpose);
                                const schedule = app.training_schedule || details.schedule;
                                const schedBadge = formatTrainingScheduleBadge(schedule);
                                return (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${schedBadge.badgeClass}`}>
                                    {schedBadge.label}
                                  </span>
                                );
                              })()}
                              <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                📍 {app.electoral_area || "Amanful West"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div>{app.gender}</div>
                        <div className="text-[11px] text-slate-400">DOB: {formatDate(app.date_of_birth)}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{app.id_type}</div>
                        <div className="font-mono text-[11px] text-slate-500">{app.id_number}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-800">{app.phone_number}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {app.email}
                        </div>
                      </td>

                      <td className="p-4 text-slate-500">
                        {formatDate(app.created_at)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400 space-y-2">
                    <p className="text-sm font-semibold text-slate-600">No applications match your criteria.</p>
                    <p className="text-xs">Try adjusting your search keywords or status filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span>
              Showing{" "}
              <strong className="text-slate-900 font-bold">
                {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-slate-900 font-bold">
                {Math.min(currentPage * pageSize, totalCount)}
              </strong>{" "}
              of <strong className="text-slate-900 font-bold">{totalCount}</strong> applications
            </span>

            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-300">
              <label htmlFor="pageSizeSelect" className="text-slate-500">Per page:</label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                  );
                })
                .map((p, idx, arr) => {
                  const prevP = arr[idx - 1];
                  const showEllipsis = prevP && p - prevP > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="px-1 text-slate-400 text-xs">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        disabled={loading}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          currentPage === p
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details & Action Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Batch Rejection Mandatory Reason Modal */}
      <RejectionReasonModal
        isOpen={showBatchRejectModal}
        targetDescription={`${selectedIds.length} selected candidate(s)`}
        onClose={() => setShowBatchRejectModal(false)}
        onConfirm={(reason) => handleBatchStatus("rejected", reason)}
        isLoading={batchLoading}
      />

      {/* Electoral Area Summary Report Modal */}
      <ElectoralAreaSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        passcode={adminPasscode}
      />

      {/* Schedule & Cohort Management Modal (Super Admin Exclusive) */}
      {isSuperAdmin && showScheduleModal && (
        <ScheduleManagementModal
          onClose={() => {
            setShowScheduleModal(false);
            loadData();
          }}
          adminPasscode={adminPasscode}
        />
      )}

      {/* Field Operations, Testing, Fuel & Provisional Certification Modal */}
      {showOperationsModal && (
        <OperationsDashboardModal
          onClose={() => {
            setShowOperationsModal(false);
            loadData();
          }}
          adminPasscode={adminPasscode}
        />
      )}
        </>
      )}
    </div>
  );
}
