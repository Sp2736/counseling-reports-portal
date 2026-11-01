"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, AlertCircle, ArrowLeft, Save, Sparkles } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";
import { DUMMY_STUDENT } from "@/src/lib/demo-data";

export default function StudentProfilePage() {
  const router = useRouter();
  const { studentProfile, setStudentProfile, counselors } = useDemo();

  const [fullName, setFullName] = useState(studentProfile.fullName);
  const [department, setDepartment] = useState(studentProfile.department);
  const [assignedCounselor, setAssignedCounselor] = useState(studentProfile.assignedCounselor);

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");

    setTimeout(() => {
      const counselorObj = counselors.find((c) => c._id === assignedCounselor);
      setStudentProfile((prev) => ({
        ...prev,
        fullName,
        department,
        assignedCounselor,
        assignedCounselorName: counselorObj?.fullName || "Assigned Counselor",
      }));

      setStatus("success");
      setMessage("Profile settings updated successfully!");

      setTimeout(() => setStatus("idle"), 3000);
    }, 350);
  };

  const handleReset = () => {
    setFullName(DUMMY_STUDENT.fullName);
    setDepartment(DUMMY_STUDENT.department);
    setAssignedCounselor(DUMMY_STUDENT.assignedCounselor);
  };

  const inputStyles =
    "w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base transition";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="p-1.5 cursor-pointer sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Student Profile Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
              Manage personal details, academic department, and counselor assignment.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Personal & Academic Details
              </h2>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Reset to Sample</span>
            </button>
          </div>

          {status === "success" && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 shrink-0" />
              <p className="text-xs sm:text-sm font-bold text-emerald-800">{message}</p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                className={inputStyles}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Student ID (Permanent)
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 font-mono font-bold cursor-not-allowed text-sm sm:text-base"
                  value={studentProfile.studentId}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  required
                  className={inputStyles}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-gray-100">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Assigned Faculty Counselor
              </label>
              <select
                required
                className={inputStyles}
                value={assignedCounselor}
                onChange={(e) => setAssignedCounselor(e.target.value)}
              >
                {counselors.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.fullName} ({c.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 sm:pt-6 flex justify-end">
              <button
                type="submit"
                disabled={status === "saving"}
                className="w-full sm:w-auto flex justify-center cursor-pointer items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm sm:text-base font-bold hover:bg-indigo-700 disabled:bg-indigo-400 transition shadow-md shadow-indigo-600/20"
              >
                <Save className="w-4 h-4 mr-2" />
                {status === "saving" ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
