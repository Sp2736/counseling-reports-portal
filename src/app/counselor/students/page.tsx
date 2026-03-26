// src/app/counselor/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ChevronRight, User, AlertCircle, Filter } from "lucide-react";

type FilterType = "All" | "Action Required" | "No Action Required" | "Not Submitted";

export default function CounselorStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");

  useEffect(() => {
    fetch("/api/counselor/students")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Roster Loading Error:", err);
        setError(err.message || "Failed to establish database connection.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredStudents = students.filter((student) => {
    if (filter === "Action Required") return student.pendingCount > 0;
    if (filter === "No Action Required") return student.pendingCount === 0 && student.latestRiskLevel !== "N/A";
    if (filter === "Not Submitted") return student.pendingCount === 0 && student.latestRiskLevel === "N/A";
    return true;
  });

  if (isLoading)
    return (
      <div className="p-4 sm:p-8 text-center text-gray-500 font-medium">
        Loading Student Directory...
      </div>
    );
  if (error)
    return (
      <div className="p-8 max-w-lg mx-auto mt-12 bg-red-50 border border-red-200 rounded-xl text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-800">
          Directory Failed to Load
        </h3>
        <p className="text-red-600 mt-1 text-sm">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Student Directory
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View all students currently assigned to your matrix.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="text-sm border-none bg-transparent outline-none focus:ring-0 text-gray-700 font-medium cursor-pointer"
            >
              <option value="All">All Students</option>
              <option value="Action Required">Action Required</option>
              <option value="No Action Required">No Action Required</option>
              <option value="Not Submitted">Not Submitted</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center space-x-3 bg-gray-50/50">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Assigned Roster ({filteredStudents.length})
            </h2>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">
                    Student Identity
                  </th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">
                    Contact / Email
                  </th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">
                    Counseling Status
                  </th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600">
                    Latest Risk Factor
                  </th>
                  <th className="p-4 text-xs sm:text-sm font-semibold text-gray-600 text-right">
                    View History
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 sm:p-12 text-center text-gray-500"
                    >
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm sm:text-base">
                        No students match the selected filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {student.fullName}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 font-mono mt-0.5">
                          ID: {student.studentId} • {student.department}
                        </div>
                      </td>

                      <td className="p-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                        {student.email}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1.5">
                          {student.pendingCount > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-orange-100 text-orange-800 w-fit">
                              {student.pendingCount} Action Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-600 w-fit">
                              No Pending Action
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {student.latestRiskLevel !== "N/A" ? (
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                              student.latestRiskLevel === "High" ||
                              student.latestRiskLevel === "Critical"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : student.latestRiskLevel === "Medium"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {student.latestRiskLevel} Risk
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-400 font-medium border border-gray-200 px-2.5 py-1 rounded-full bg-gray-50">
                            No Data Available
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <Link
                          href={`/counselor/students/${student._id}`}
                          className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 bg-white border border-gray-200 text-gray-700 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-all"
                        >
                          <span className="hidden sm:inline mr-1.5">
                            Profile
                          </span>
                          <ChevronRight className="w-4 h-4" />
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