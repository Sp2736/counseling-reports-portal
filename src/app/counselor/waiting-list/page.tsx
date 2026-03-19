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
        // THE FIX: Ensure recordsData is actually an array before saving it to state.
        // If it's an error object, fallback to an empty array [].
        setRecords(Array.isArray(recordsData) ? recordsData : []);

        // Do the same for stats to prevent crashes if it fails
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

      // Update UI seamlessly
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

        {/* --- METRICS GRID --- */}
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

            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-700">
                  Period-wise Breakdown
                </h3>
              </div>
              <div className="flex justify-between items-center text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.periodStats.period1}
                  </p>
                  <p className="text-xs text-gray-500">Period 1</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.periodStats.period2}
                  </p>
                  <p className="text-xs text-gray-500">Period 2</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.periodStats.period3}
                  </p>
                  <p className="text-xs text-gray-500">Period 3</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.periodStats.period4}
                  </p>
                  <p className="text-xs text-gray-500">Period 4</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- RECORDS TABLE --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Student Reports</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Student
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Period
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Added a fallback so if records is empty, it shows a friendly message */}
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
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Needs Review
                        </span>
                      )}
                      {record.status === "Reviewed_Completed" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                      {record.status === "Cancelled_By_Counselor" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      )}
                      {record.status === "Cancelled_By_Student" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Withdrawn
                        </span>
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

        {/* --- CANCELLATION MODAL --- */}
        {cancelModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Reject Report
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason. This will be visible to the student.
              </p>

              <textarea
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., The document was blank, please upload your actual SWOT."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelReport}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                >
                  {isCancelling ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
