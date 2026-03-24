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

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Student History...</div>;
  if (error || !student) return <div className="p-8 text-center text-red-500">{error || "Student not found."}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => router.push("/counselor/students")} className="p-2 cursor-pointer bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Profile & History</h1>
            <p className="text-gray-600 mt-1">Reviewing past counseling records and AI insights.</p>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-6">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{student.fullName}</h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center"><FileText className="w-4 h-4 mr-1"/> ID: {student.studentId}</span>
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Dept: {student.department}</span>
            </div>
          </div>
        </div>

        {/* Submission History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800">Reviewed Submission History</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-600">Period</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Date Submitted</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Final Risk Level</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">This student has no reviewed reports yet.</td></tr>
                ) : (
                  records.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">Period {record.report_period || 1}</td>
                      <td className="p-4 text-gray-600">{new Date(record.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                      </td>
                      <td className="p-4">
                        {record.counselor_review?.final_risk_level ? (
                          <span className={`font-medium ${record.counselor_review.final_risk_level === 'High' ? 'text-red-600' : 'text-gray-900'}`}>
                            {record.counselor_review.final_risk_level}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link 
                          href={`/counselor/record/${record._id}`} 
                          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-md"
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