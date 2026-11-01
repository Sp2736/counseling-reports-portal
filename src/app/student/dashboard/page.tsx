"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, XCircle, Printer, AlertCircle, Bot } from "lucide-react";
import Link from "next/link";
import { useDemo } from "@/src/lib/demo-context";

export default function StudentDashboard() {
  const router = useRouter();
  const { studentProfile, records, cancelRecordByStudent } = useDemo();

  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Filter records belonging to this student (or match studentId / name)
  const studentReports = records.filter(
    (r) =>
      r.student?._id === studentProfile._id ||
      r.student?.studentId === studentProfile.studentId ||
      r.student?.fullName === studentProfile.fullName
  );

  const handlePrint = (reportId: string) => {
    router.push(`/student/print-report?id=${reportId}`);
  };

  const handleCancelUpload = (reportId: string) => {
    if (!confirm("Are you sure you want to cancel this submission?")) return;
    cancelRecordByStudent(reportId);
  };

  const openReasonModal = (report: any) => {
    setSelectedReport(report);
    setReasonModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 relative pb-24 sm:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Student Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Welcome back, <strong>{studentProfile.fullName}</strong> ({studentProfile.studentId}) · Track your counseling reports and growth.
            </p>
          </div>
          <Link
            href="/student/upload"
            className="flex items-center justify-center w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm font-bold text-sm sm:text-base"
          >
            <UploadCloud className="w-5 h-5 mr-2" /> New Submission
          </Link>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-white flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Your Submission History ({studentReports.length})
            </h2>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Date Submitted</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Period</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentReports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 sm:p-12 text-center text-gray-500">
                      <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm sm:text-base font-medium">
                        You haven't submitted any SWOT reports yet in this session.
                      </p>
                      <Link
                        href="/student/upload"
                        className="mt-3 inline-flex items-center text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Click here to create a new submission →
                      </Link>
                    </td>
                  </tr>
                ) : (
                  studentReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 text-sm sm:text-base text-gray-900 font-medium whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm sm:text-base text-gray-700 whitespace-nowrap font-medium">
                        Period {report.report_period || 1}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {report.status === "Pending_AI" && (
                          <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-yellow-100 text-yellow-800">
                            <span className="w-2 h-2 mr-1.5 bg-yellow-500 rounded-full animate-pulse"></span> Processing Analysis
                          </span>
                        )}
                        {report.status === "Needs_Review" && (
                          <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-800">
                            In Review Queue
                          </span>
                        )}
                        {report.status === "Reviewed_Completed" && (
                          <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800">
                            Reviewed & Finalized
                          </span>
                        )}
                        {report.status === "Cancelled_By_Counselor" && (
                          <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-100 text-red-800">
                            Rejected by Counselor
                          </span>
                        )}
                        {report.status === "Cancelled_By_Student" && (
                          <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-800">
                            Cancelled by You
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        {report.status === "Reviewed_Completed" && (
                          <button
                            onClick={() => handlePrint(report._id)}
                            className="inline-flex items-center px-2.5 cursor-pointer py-1.5 sm:px-3 sm:py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs sm:text-sm font-bold transition"
                          >
                            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" /> Print Report
                          </button>
                        )}
                        {(report.status === "Pending_AI" || report.status === "Needs_Review") && (
                          <button
                            onClick={() => handleCancelUpload(report._id)}
                            className="inline-flex cursor-pointer items-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs sm:text-sm font-medium transition"
                          >
                            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" /> Cancel
                          </button>
                        )}
                        {report.status === "Cancelled_By_Counselor" && (
                          <button
                            onClick={() => openReasonModal(report)}
                            className="inline-flex cursor-pointer items-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs sm:text-sm font-bold transition"
                          >
                            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" /> View Reason
                          </button>
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

      {/* Reason Modal */}
      {reasonModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 sm:p-3 bg-red-100 text-red-600 rounded-full shrink-0">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Report Rejected</h3>
                <p className="text-xs sm:text-sm text-slate-500">{new Date(selectedReport.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 max-h-48 overflow-y-auto">
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Counselor's Reason</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {selectedReport.counselor_review?.final_action_plan?.replace("Reason for Rejection:\n", "") || "No specific reason provided."}
              </p>
            </div>

            <button
              onClick={() => setReasonModalOpen(false)}
              className="w-full px-5 py-3 bg-slate-900 text-white cursor-pointer font-bold rounded-xl hover:bg-slate-800 transition shadow-md"
            >
              Close & Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
