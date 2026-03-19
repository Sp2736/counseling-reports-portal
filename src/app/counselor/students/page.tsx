// src/app/counselor/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CounselorStudentsRoster() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/counselor/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setStudents([]);
        setIsLoading(false);
      });
  }, []);

  // Simple search filter
  const filteredStudents = students.filter(student => 
    student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Student Roster...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={() => router.push("/counselor/waiting-list")} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assigned Students</h1>
            <p className="text-gray-600 mt-1">View the complete roster of students under your guidance.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-100 bg-white flex items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Roster Grid */}
          <div className="p-6">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                <Users className="w-12 h-12 text-gray-300 mb-3" />
                <p>No students found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student) => (
                  <div key={student._id} className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-md transition-all bg-white group flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.fullName}</h3>
                      <p className="text-sm text-gray-500 mb-1">ID: {student.studentId}</p>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md mt-2">
                        {student.department}
                      </span>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      {/* This will link to the specific student's history page we will build next */}
                      <Link 
                        href={`/counselor/students/${student._id}`}
                        className="flex items-center justify-between text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View Full History <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}