// src/app/counselor/students/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, FileText, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CounselorStudentHistoryPage() {
  const params = useParams();
  const router = useRouter();
  
  const [student, setStudent] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/counselor/students/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load student history");
        return res.json();
      })
      .then((data) => {
        setStudent(data.student);
        setRecords(data.records || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [params.id]);

  if (isLoading) return <div className="p-4 sm:p-8 text-center text-gray-500 text-sm sm:text-base">Loading Student History...</div>;
  if (error || !student) return <div className="p-4 sm:p-8 text-center text-red-500 text-sm sm:text-base">{error || "Student not found."}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <button onClick={() => router.push("/counselor/students")} className="p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors mt-0.5 sm:mt-0 shrink-0">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">Student Profile & History</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Reviewing past counseling records and AI insights.</p>
          </div>
        </div>

        {/* Student Info Card - Stacks on mobile */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <div className="h-14 w-14 sm:h-16 sm:w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
            <User className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{student.fullName}</h2>
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center"><FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"/> ID: {student.studentId}</span>
              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"/> Dept: {student.department}</span>
            </div>
          </div>
        </div>

        {/* Submission History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 sm:mt-8">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Reviewed Submission History</h3>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-600">Period</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-600">Date Submitted</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-600">Final Risk Level</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">This student has no reviewed reports yet.</td></tr>
                ) : (
                  records.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 sm:p-4 font-medium text-gray-900 text-sm sm:text-base whitespace-nowrap">Period {record.report_period || 1}</td>
                      <td className="p-3 sm:p-4 text-gray-600 text-sm sm:text-base whitespace-nowrap">{new Date(record.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">Completed</span>
                      </td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        {record.counselor_review?.final_risk_level ? (
                          <span className={`font-medium text-sm sm:text-base ${record.counselor_review.final_risk_level === 'High' ? 'text-red-600' : 'text-gray-900'}`}>
                            {record.counselor_review.final_risk_level}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                        <Link 
                          href={`/counselor/record/${record._id}`} 
                          className="inline-flex items-center text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-md"
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