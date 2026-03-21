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
      <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Counselor Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your assigned students and review SWOT reports.
          </p>
        </div>

        {/* --- METRICS GRID (Unchanged) --- */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">My Students</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
                </h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Submissions
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.totalSubmitted}
                </h3>
              </div>
            </div>

            
          </div>
        )}

        {/* --- RECORDS TABLE (Unchanged) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Student Reports</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">Student</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Period</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No student records found.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {record.student?.fullName || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.student?.studentId || "N/A"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">
                      Period {record.report_period || 1}
                    </td>
                    <td className="p-4">
                      {record.status === "Needs_Review" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Needs Review</span>
                      )}
                      {record.status === "Reviewed_Completed" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                      )}
                      {record.status === "Cancelled_By_Counselor" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>
                      )}
                      {record.status === "Cancelled_By_Student" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Withdrawn</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {(record.status === "Needs_Review" ||
                        record.status === "Reviewed_Completed") && (
                        <Link
                          href={`/counselor/record/${record._id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors font-medium text-sm"
                        >
                          <Bot className="w-4 h-4 mr-1.5" />{" "}
                          {record.status === "Needs_Review"
                            ? "Review & AI"
                            : "View Report"}
                        </Link>
                      )}
                      {record.status === "Needs_Review" && (
                        <button
                          onClick={() => openCancelModal(record._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors font-medium text-sm"
                        >
                          <XCircle className="w-4 h-4 mr-1.5" /> Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- IMPROVED CANCELLATION MODAL --- */}
        {cancelModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Reject Report
                </h3>
              </div>
              
              <p className="text-sm text-slate-600 mb-6 font-medium">
                Please provide a clear reason for rejection. This will be sent directly to the student.
              </p>

              <textarea
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., The document was blank, please upload your actual SWOT."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 text-slate-900 placeholder-slate-400 font-medium resize-none transition-all mb-6"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-5 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelReport}
                  disabled={isCancelling}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isCancelling ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}