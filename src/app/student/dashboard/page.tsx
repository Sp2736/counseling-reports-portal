// src/app/student/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, XCircle, Printer, CalendarClock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
    if (!confirm("Are you sure you want to cancel this submission?")) return;
    
    try {
      const res = await fetch(`/api/student/records/${reportId}/cancel`, { method: "POST" });
      if (res.ok) {
        setReports(reports.map(r => r._id === reportId ? { ...r, status: "Cancelled_By_Student" } : r));
      } else {
        alert("Failed to cancel report.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your counseling reports and academic growth.</p>
          </div>
          <Link 
            href="/student/upload" 
            className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
          >
            <UploadCloud className="w-5 h-5 mr-2" /> New Submission
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Your Submission History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-600">Period</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Date Submitted</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-500">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>You haven't submitted any SWOT reports yet.</p>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">Cycle {report.report_period || 1}</td>
                      <td className="p-4 text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {report.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {report.status === "Reviewed_Completed" && (
                          <button
                            onClick={() => handlePrint(report._id)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors"
                          >
                            <Printer className="w-4 h-4 mr-1.5" /> Print Report
                          </button>
                        )}
                        {(report.status === "Pending_AI" || report.status === "Needs_Review") && (
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