"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  FileText,
  AlertTriangle,
  Users,
  BarChart3,
  XCircle,
  Loader2,
  CheckSquare,
  EyeOff,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";

export default function CounselorDashboardPage() {
  const { records, studentsRoster, rejectRecord, batchApproveAll, studentProfile } = useDemo();

  const [hideReviewed, setHideReviewed] = useState(false);

  // Reject Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Batch Approve State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [isBatchApproving, setIsBatchApproving] = useState(false);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  // Derived stats
  const totalStudents = studentsRoster.length;
  const totalReports = records.length;
  const pendingAI = records.filter((r) => r.status === "Pending_AI").length;
  const needsReview = records.filter((r) => r.status === "Needs_Review").length;

  const openCancelModal = (id: string) => {
    setSelectedRecordId(id);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const handleCancelReport = () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }
    setIsCancelling(true);
    setTimeout(() => {
      rejectRecord(selectedRecordId, cancelReason);
      setIsCancelling(false);
      setCancelModalOpen(false);
    }, 300);
  };

  const handleBatchApprove = () => {
    setIsBatchApproving(true);
    setTimeout(() => {
      batchApproveAll();
      setIsBatchApproving(false);
      setBatchModalOpen(false);
    }, 400);
  };

  const filteredRecords = hideReviewed
    ? records.filter((r) => ["Needs_Review", "Pending_AI"].includes(r.status))
    : records;

  const needsReviewRecords = records.filter((r) => r.status === "Needs_Review");

  const riskGroups = {
    High: needsReviewRecords.filter((r) =>
      ["High", "Critical"].includes(r.ai_analysis?.risk_prediction?.risk_level || "")
    ),
    Medium: needsReviewRecords.filter(
      (r) => r.ai_analysis?.risk_prediction?.risk_level === "Medium"
    ),
    Low: needsReviewRecords.filter(
      (r) => r.ai_analysis?.risk_prediction?.risk_level === "Low"
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Counselor Command Center
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Review assigned students, inspect simulated AI diagnostics, and finalize official SWOT records.
            </p>
          </div>
          {needsReviewRecords.length > 0 && (
            <button
              onClick={() => setBatchModalOpen(true)}
              className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm cursor-pointer text-sm"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Batch Approve All ({needsReviewRecords.length})
            </button>
          )}
        </div>

        {/* Live Pipeline banner if student just submitted */}
        {needsReviewRecords.some((r) => r.student?.studentId === studentProfile.studentId) && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-indigo-900 text-sm">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>
                <strong>Live Session Updated:</strong> Student <strong>{studentProfile.fullName}</strong> has a SWOT analysis awaiting your review in the Action Queue below!
              </span>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500">My Students</p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">{totalStudents}</h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500">Total Reviews</p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">{totalReports}</h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500">Pending AI Sync</p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">{pendingAI}</h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500">Needs My Review</p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">{needsReview}</h3>
            </div>
          </div>
        </div>

        {/* Action Queue Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Action Queue</h2>
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                {needsReviewRecords.length} Pending Action
              </span>
            </div>
            <button
              onClick={() => setHideReviewed(!hideReviewed)}
              className="inline-flex cursor-pointer items-center px-3.5 py-1.5 text-xs sm:text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              {hideReviewed ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {hideReviewed ? "Show All Records" : "Hide Completed"}
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Student</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Period</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">AI Risk Level</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 sm:p-12 text-center text-gray-500">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-sm sm:text-base text-gray-900">
                          {record.student?.fullName || "Student"}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {record.student?.studentId} • {record.student?.department}
                        </div>
                      </td>

                      <td className="p-4 text-sm sm:text-base text-gray-700 whitespace-nowrap font-medium">
                        Period {record.report_period || 1}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {record.ai_analysis ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              record.ai_analysis.risk_prediction.risk_level === "High" ||
                              record.ai_analysis.risk_prediction.risk_level === "Critical"
                                ? "bg-red-100 text-red-700"
                                : record.ai_analysis.risk_prediction.risk_level === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {record.ai_analysis.risk_prediction.risk_level} (
                            {record.ai_analysis.risk_prediction.risk_score}/10)
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Processing...</span>
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {record.status === "Needs_Review" && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            Needs Review
                          </span>
                        )}
                        {record.status === "Reviewed_Completed" && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        )}
                        {record.status === "Cancelled_By_Counselor" && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            Rejected
                          </span>
                        )}
                        {record.status === "Cancelled_By_Student" && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                            Student Cancelled
                          </span>
                        )}
                        {record.status === "Pending_AI" && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                            <span className="w-2 h-2 mr-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                            AI Syncing
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        {record.status === "Pending_AI" ? (
                          <button
                            disabled
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed"
                          >
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            Processing
                          </button>
                        ) : record.status === "Needs_Review" ? (
                          <>
                            <Link
                              href={`/counselor/record?id=${record._id}`}
                              className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs sm:text-sm font-bold transition"
                            >
                              <Bot className="w-3.5 h-3.5 mr-1.5" />
                              Review
                            </Link>
                            <button
                              onClick={() => openCancelModal(record._id)}
                              className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs sm:text-sm font-medium transition"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1.5" />
                              Reject
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/counselor/record?id=${record._id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-medium transition"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
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

      {/* Reject Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Reject SWOT Submission
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Provide constructive guidance for the student.
                </p>
              </div>
            </div>

            <textarea
              className="w-full p-3.5 border border-slate-300 rounded-xl mb-5 focus:ring-2 focus:ring-red-500 outline-none text-sm text-slate-800 bg-slate-50 resize-none h-28"
              placeholder="e.g., Please provide more specific reflections regarding time management challenges..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelReport}
                disabled={isCancelling}
                className="px-5 py-2 font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 transition shadow-sm text-sm cursor-pointer"
              >
                {isCancelling ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Approve Modal */}
      {batchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Batch Approve All Submissions
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              You are about to auto-fill and approve <strong>{needsReviewRecords.length} pending reports</strong> using AI-generated interventions.
            </p>

            <div className="space-y-3 mb-6">
              {Object.entries(riskGroups).map(([level, items]) => (
                <div key={level} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedRisk(expandedRisk === level ? null : level)}
                    className={`w-full flex items-center justify-between p-4 cursor-pointer ${
                      level === "High"
                        ? "bg-red-50 hover:bg-red-100"
                        : level === "Medium"
                        ? "bg-yellow-50 hover:bg-yellow-100"
                        : "bg-emerald-50 hover:bg-emerald-100"
                    } transition-colors`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-bold ${
                          level === "High"
                            ? "text-red-700"
                            : level === "Medium"
                            ? "text-yellow-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {level} Risk
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-white rounded-full">
                        {items.length} students
                      </span>
                    </div>
                    {expandedRisk === level ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {expandedRisk === level && items.length > 0 && (
                    <div className="p-4 bg-white border-t border-slate-100 max-h-40 overflow-y-auto">
                      <ul className="space-y-2">
                        {items.map((r: any) => (
                          <li key={r._id} className="text-sm flex justify-between">
                            <span className="font-medium text-slate-800">{r.student?.fullName}</span>
                            <span className="text-slate-500 font-mono text-xs">{r.student?.studentId}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setBatchModalOpen(false)}
                className="px-4 py-2 cursor-pointer text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchApprove}
                disabled={isBatchApproving}
                className="px-5 py-2 cursor-pointer font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm text-sm"
              >
                {isBatchApproving ? "Processing..." : `Approve All (${needsReviewRecords.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
