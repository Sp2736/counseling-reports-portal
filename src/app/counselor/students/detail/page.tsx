"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, User, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { useDemo } from "@/src/lib/demo-context";

function StudentHistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { getStudentById, records } = useDemo();

  const [student, setStudent] = useState<any>(null);
  const [studentRecords, setStudentRecords] = useState<any[]>([]);

  useEffect(() => {
    const s = getStudentById(id || "stud-live");
    setStudent(s);
    const recs = records.filter(
      (r) =>
        r.student?._id === id ||
        r.student?.studentId === s?.studentId ||
        r.student?.fullName === s?.fullName
    );
    setStudentRecords(recs);
  }, [id, getStudentById, records]);

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Student Record...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.push("/counselor/students")}
            className="p-2 cursor-pointer bg-white rounded-full shadow-sm hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Student Profile & Counseling History
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Reviewing past counseling records, AI insights, and semester evaluations.
            </p>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-6">
          <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">{student.fullName}</h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600 font-medium">
              <span className="flex items-center font-mono">
                <FileText className="w-4 h-4 mr-1 text-indigo-600" /> ID: {student.studentId}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-indigo-600" /> Dept: {student.department}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{student.email}</span>
            </div>
          </div>
        </div>

        {/* Submission History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100 bg-gray-50/70">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              Recorded Submissions ({studentRecords.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Period</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Date Submitted</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">Final Risk Level</th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      This student has no reviewed reports yet in this session.
                    </td>
                  </tr>
                ) : (
                  studentRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-sm sm:text-base text-gray-900">
                        Period {record.report_period || 1}
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-medium">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            record.status === "Reviewed_Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : record.status === "Needs_Review"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {record.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-sm">
                        {record.counselor_review?.final_risk_level ? (
                          <span
                            className={
                              record.counselor_review.final_risk_level === "High"
                                ? "text-red-600"
                                : "text-gray-900"
                            }
                          >
                            {record.counselor_review.final_risk_level}
                          </span>
                        ) : record.ai_analysis?.risk_prediction?.risk_level ? (
                          <span className="text-slate-600">
                            {record.ai_analysis.risk_prediction.risk_level} (AI)
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/counselor/record?id=${record._id}`}
                          className="inline-flex items-center text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3.5 py-1.5 rounded-xl transition"
                        >
                          View Report
                        </Link>
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

export default function CounselorStudentHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-medium">
          Loading Student Profile...
        </div>
      }
    >
      <StudentHistoryContent />
    </Suspense>
  );
}

