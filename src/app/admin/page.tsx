"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Application, ApplicationStatus, DashboardStats } from "@/lib/types";
import { formatApplicationStatus, formatDate, formatDateTime } from "@/lib/utils";
import AdminStats from "@/components/AdminStats";
import ApplicationDetailsModal from "@/components/ApplicationDetailsModal";
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
  UserCheck,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // Authentication check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("kbdr_admin_authenticated");
      if (auth !== "true") {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/admin?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setApplications(data.data || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus, admin_notes: notes }),
    });

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

  const handleBatchStatus = async (status: ApplicationStatus) => {
    if (selectedIds.length === 0) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchIds: selectedIds, status }),
      });
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

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) return;

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
      "Takoradi Electoral Area",
      "House Address",
      "Postal Address",
      "Status",
      "Admin Notes",
      "Created At",
    ];

    const rows = applications.map((app) => [
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
      `"${(app.training_purpose || "Personal").replace(/"/g, '""')}"`,
      `"${(app.electoral_area || "Amanful West").replace(/"/g, '""')}"`,
      `"${app.house_address.replace(/"/g, '""')}"`,
      `"${(app.postal_address || "").replace(/"/g, '""')}"`,
      `"${app.status}"`,
      `"${(app.admin_notes || "").replace(/"/g, '""')}"`,
      `"${app.created_at}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kobbydrive_applications_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter applications by client-side filters if needed
  const filteredApplications = applications.filter((app) => {
    if (genderFilter !== "all" && app.gender !== genderFilter) return false;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Admin Monitoring Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Free Driving School Program • Real-time Application Tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export to CSV
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

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
          </div>
        </div>

        {/* Batch Actions Toolbar (if any selected) */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-brand-900">
              {selectedIds.length} candidate(s) selected
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBatchStatus("approved")}
                disabled={batchLoading}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                Approve Selected
              </button>
              <button
                onClick={() => handleBatchStatus("in_training")}
                disabled={batchLoading}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
              >
                Set In Training
              </button>
              <button
                onClick={() => handleBatchStatus("rejected")}
                disabled={batchLoading}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
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
                        <div className="font-bold text-slate-900">
                          {app.title} {app.surname} {app.last_name}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-400">{app.nationality}</span>
                          <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200">
                            {app.training_purpose || "Personal"}
                          </span>
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            📍 {app.electoral_area || "Amanful West"}
                          </span>
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
      </div>

      {/* Details & Action Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
