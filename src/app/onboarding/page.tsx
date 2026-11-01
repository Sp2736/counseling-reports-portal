"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Briefcase, ChevronRight, ShieldCheck } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { role, studentProfile, setStudentProfile, counselorProfile, setCounselorProfile, counselors } = useDemo();

  const [counselorData, setCounselorData] = useState({
    employeeId: counselorProfile.employeeId,
    title: "Dr.",
    fullName: counselorProfile.fullName,
    department: counselorProfile.department,
    expertise: counselorProfile.expertise,
  });

  const [studentData, setStudentData] = useState({
    fullName: studentProfile.fullName,
    studentId: studentProfile.studentId,
    assignedCounselor: studentProfile.assignedCounselor,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "student") {
      setStudentProfile((prev) => ({
        ...prev,
        fullName: studentData.fullName,
        studentId: studentData.studentId.toUpperCase(),
        assignedCounselor: studentData.assignedCounselor,
      }));
      router.push("/student/dashboard");
    } else {
      setCounselorProfile((prev) => ({
        ...prev,
        fullName: `${counselorData.title} ${counselorData.fullName}`,
        employeeId: counselorData.employeeId.toUpperCase(),
        department: counselorData.department,
        expertise: counselorData.expertise,
      }));
      router.push("/counselor/waiting-list");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans py-8 sm:py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-6 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm">
            {role === "student" ? (
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            ) : (
              <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Complete Your Profile</h2>
          <p className="text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm">Set up your university credentials to access the matrix.</p>
        </div>

        <div className="p-6 sm:p-8">
          {role === "counselor" ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-3 sm:flex sm:space-x-4 gap-3 sm:gap-0">
                <div className="col-span-1 sm:w-1/3">
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Title</label>
                  <select
                    className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium bg-slate-50 text-sm sm:text-base"
                    value={counselorData.title}
                    onChange={(e) => setCounselorData({ ...counselorData, title: e.target.value })}
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                </div>
                <div className="col-span-2 sm:w-2/3">
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-slate-50 placeholder-slate-400 text-sm sm:text-base"
                    value={counselorData.fullName}
                    onChange={(e) => setCounselorData({ ...counselorData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Faculty ID</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono font-bold uppercase tracking-widest bg-slate-50 text-sm sm:text-base"
                  value={counselorData.employeeId}
                  onChange={(e) => setCounselorData({ ...counselorData, employeeId: e.target.value.toUpperCase() })}
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer mt-5 sm:mt-6 bg-indigo-600 text-white p-3 sm:p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center group shadow-md text-sm sm:text-base"
              >
                <span>Enter Command Center</span>
                <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Full Legal Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 sm:p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-slate-50 text-sm sm:text-base font-medium"
                  value={studentData.fullName}
                  onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Student ID</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 sm:p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono font-bold uppercase tracking-widest bg-slate-50 text-sm sm:text-base"
                  value={studentData.studentId}
                  onChange={(e) => setStudentData({ ...studentData, studentId: e.target.value.toUpperCase() })}
                />
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 shrink-0" /> Format: STU-2026-1088
                </p>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Assigned Counselor</label>
                <select
                  required
                  className="w-full p-3 sm:p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium bg-slate-50 text-sm sm:text-base cursor-pointer"
                  value={studentData.assignedCounselor}
                  onChange={(e) => setStudentData({ ...studentData, assignedCounselor: e.target.value })}
                >
                  {counselors.map((c) => (
                    <option key={c._id} value={c._id}>{c.fullName}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer mt-5 sm:mt-6 bg-slate-900 text-white p-3 sm:p-3.5 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center group shadow-md text-sm sm:text-base"
              >
                <span>Access Dashboard</span>
                <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
