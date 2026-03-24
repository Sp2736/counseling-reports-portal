// src/app/counselor/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, AlertCircle, ArrowLeft, Save, Briefcase } from "lucide-react";

export default function CounselorProfilePage() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [expertise, setExpertise] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/counselor/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile data");
        return res.json();
      })
      .then((data) => {
        setFullName(data.fullName || "");
        setEmployeeId(data.employeeId || "");
        setDepartment(data.department || "");
        setExpertise(data.expertise || "");
        setStatus("idle");
      })
      .catch((err) => {
        setMessage(err.message);
        setStatus("error");
      });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const res = await fetch("/api/counselor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, department, expertise }),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      setStatus("success");
      setMessage("Profile updated successfully!");
      setTimeout(() => setStatus("idle"), 3000);

    } catch (error: any) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base";

  if (status === "loading") return <div className="p-4 sm:p-8 text-center text-gray-500 text-sm sm:text-base">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
          <button onClick={() => router.push("/counselor/waiting-list")} className="p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors mt-0.5 sm:mt-0 shrink-0">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">Counselor Settings</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Manage your professional details and counseling parameters.</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-5 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Professional Details</h2>
          </div>

          {status === "success" && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-green-800">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-red-800">{message}</p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required className={inputStyles} value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Employee ID (Read-Only)</label>
                <input type="text" disabled className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed text-sm sm:text-base" value={employeeId} />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Department / Faculty</label>
              <input type="text" required className={inputStyles} value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Areas of Expertise (Counseling Range)</label>
              <textarea 
                rows={4}
                placeholder="e.g., Academic Stress, Career Transition, CS/IT Students"
                className={inputStyles} 
                value={expertise} 
                onChange={(e) => setExpertise(e.target.value)} 
              />
            </div>

            <div className="pt-4 sm:pt-6 flex justify-end">
              <button type="submit" disabled={status === "saving"} className="w-full sm:w-auto flex justify-center items-center px-6 py-2.5 bg-indigo-600 text-white rounded-md text-sm sm:text-base font-medium hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
                <Save className="w-4 h-4 mr-1.5 sm:mr-2" />
                {status === "saving" ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}