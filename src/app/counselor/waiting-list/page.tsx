// src/app/counselor/waiting-list/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  XCircle,
} from "lucide-react";

export default function CounselorDashboardPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/counselor/records").then((res) => res.json()),
      fetch("/api/counselor/stats").then((res) => res.json()),
    ])
      .then(([recordsData, statsData]) => {
        setRecords(Array.isArray(recordsData) ? recordsData : []);
        setStats(statsData.error ? null : statsData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setRecords([]);
        setIsLoading(false);
      });
  }, []);

  const openCancelModal = (id: string) => {
    setSelectedRecordId(id);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const handleCancelReport = async () => {
    if (!cancelReason.trim())
      return alert("Please provide a reason for cancellation.");
    setIsCancelling(true);

    try {
      const res = await fetch(
        `/api/counselor/records/${selectedRecordId}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cancellation_reason: cancelReason }),
        },
      );

      if (!res.ok) throw new Error("Failed to cancel report");

      setRecords(
        records.map((r) =>
          r._id === selectedRecordId
            ? { ...r, status: "Cancelled_By_Counselor" }
            : r,
        ),
      );
      setCancelModalOpen(false);
    } catch (error) {
      alert("Error cancelling report.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-4 sm:p-8 text-center text-gray-500">Loading Dashboard...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Counselor Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your assigned students and review SWOT reports.
          </p>
        </div>

        {/* METRICS GRID - Fully responsive stack on mobile */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">My Students</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
                </h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Reviews
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.totalReports}
                </h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Pending AI Sync
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.pendingAI}
                </h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Needs My Review
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.needsReview}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Needs Immediate Review
            </h2>
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
              {records.filter((r) => r.status === "Needs_Review").length}{" "}
              Pending Action
            </span>
          </div>
          
          {/* Scrollable Table Container */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Student</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Period</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 sm:p-12 text-center text-gray-500">
                      No student records found.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium text-sm sm:text-base text-gray-900">
                          {record.student?.fullName || "Unknown"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {record.student?.studentId || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-sm sm:text-base text-gray-700 whitespace-nowrap">
                        Period {record.report_period || 1}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {record.status === "Needs_Review" && (
                          <span className="inline-flex px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                            Needs Review
                          </span>
                        )}
                        {record.status === "Reviewed_Completed" && (
                          <span className="inline-flex px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                        {record.status === "Cancelled_By_Counselor" && (
                          <span className="inline-flex px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-red-100 text-red-800">
                            Rejected
                          </span>
                        )}
                        {record.status === "Cancelled_By_Student" && (
                          <span className="inline-flex px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-slate-100 text-slate-800">
                            Student Cancelled
                          </span>
                        )}
                        {record.status === "Pending_AI" && (
                          <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-800">
                            <span className="w-2 h-2 mr-1 sm:mr-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                            AI Syncing
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        {record.status === "Needs_Review" ? (
                          <>
                            <Link
                              href={`/counselor/record/${record._id}`}
                              className="inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md text-xs sm:text-sm font-medium transition-colors"
                            >
                              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                              Review
                            </Link>
                            <button
                              onClick={() => openCancelModal(record._id)}
                              className="inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-md text-xs sm:text-sm font-medium transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                              Reject
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/counselor/record/${record._id}`}
                            className="inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-xs sm:text-sm font-medium transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {cancelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 sm:p-3 bg-red-100 text-red-600 rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Reject Submission
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  This action will cancel the student's report.
                </p>
              </div>
            </div>

            <textarea
              className="w-full p-3 sm:p-4 border border-slate-300 rounded-xl mb-6 focus:ring-2 focus:ring-red-500 outline-none text-sm sm:text-base text-slate-800 bg-slate-50 resize-none h-28"
              placeholder="Please provide a clear reason for the student (e.g. Needs more specific threat examples, SWOT is incomplete)..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelReport}
                disabled={isCancelling}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 font-bold rounded-xl text-white transition-colors shadow-sm text-sm sm:text-base ${
                  isCancelling
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isCancelling ? "Processing..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}