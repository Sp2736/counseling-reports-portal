// src/app/student/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  XCircle,
  Printer,
  ExternalLink,
  CalendarClock,
  AlertCircle,
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the real data from MongoDB when the page loads
  useEffect(() => {
    fetch("/api/student/records")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch your records.");
        return res.json();
      })
      .then((data) => {
        setReports(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handlePrint = (reportId: string) => {
    window.open(`/student/print-report/${reportId}`, "_blank");
  };

  const handleCancelUpload = async (reportId: string) => {
    if (
      !confirm(
        "Are you sure you want to cancel this upload? This cannot be undone.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/student/records/${reportId}/cancel`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed to cancel report.");

      // Refresh the page data seamlessly
      const updatedReports = reports.map((r) =>
        r._id === reportId ? { ...r, status: "Cancelled_By_Student" } : r,
      );
      setReports(updatedReports);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center text-gray-500">
        Loading your dashboard...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Section: Action & Due Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Counseling Portal
            </h1>
            <p className="text-gray-600 mb-6">
              Manage your SWOT analysis submissions and view counselor feedback.
            </p>
            <div>
              <button
                onClick={() => router.push("/student/upload")}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload New SWOT Document</span>
              </button>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-xl shadow-sm text-white flex flex-col justify-center relative overflow-hidden">
            <CalendarClock className="w-24 h-24 absolute -bottom-4 -right-4 text-indigo-500 opacity-50" />
            <h3 className="text-indigo-100 font-medium mb-1 relative z-10">
              Next Submission Due
            </h3>
            <p className="text-3xl font-bold relative z-10 mb-2">
              Apr 15, 2026
            </p>
            <p className="text-sm text-indigo-200 relative z-10">
              Period 4 Report
            </p>
          </div>
        </div>

        {/* History Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">
              Submission History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-600">
                    Period
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600">
                    Date Submitted
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
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No submissions yet. Click upload to get started!
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr
                      key={report._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        Report {report.report_period || 1}/4
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </td>
                      <td className="p-4">
                        {report.status === "Pending_AI" && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Pending Review
                          </span>
                        )}
                        {report.status === "Needs_Review" && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Under Counselor Review
                          </span>
                        )}
                        {report.status === "Reviewed_Completed" && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Reviewed & Completed
                          </span>
                        )}
                        {report.status === "Cancelled_By_Counselor" && (
                          <div className="flex flex-col items-start space-y-1">
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Cancelled by Counselor
                            </span>
                            <span className="text-xs text-red-600 flex items-center mt-1">
                              <AlertCircle className="w-3 h-3 mr-1" />{" "}
                              {report.cancellation_reason}
                            </span>
                          </div>
                        )}
                        {report.status === "Cancelled_By_Student" && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            Cancelled by You
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {report.status !== "Reviewed_Completed" &&
                          report.file_url && (
                            <a
                              href={`https://docs.google.com/viewer?url=${encodeURIComponent(report.file_url)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-1.5" /> Docs
                              View
                            </a>
                          )}
                        {report.status === "Reviewed_Completed" && (
                          <button
                            onClick={() => handlePrint(report._id)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors"
                          >
                            <Printer className="w-4 h-4 mr-1.5" /> Print Report
                          </button>
                        )}
                        {(report.status === "Pending_AI" ||
                          report.status === "Needs_Review") && (
                          <button
                            onClick={() => handleCancelUpload(report._id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-sm font-medium transition-colors"
                          >
                            <XCircle className="w-4 h-4 mr-1.5" /> Cancel
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
    </div>
  );
}
