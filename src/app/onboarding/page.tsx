// src/app/onboarding/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, GraduationCap, Briefcase, ChevronRight, ShieldCheck } from "lucide-react";

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [counselors, setCounselors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [counselorData, setCounselorData] = useState({ 
    employeeId: "", // NEW: Added to state
    title: "Dr.", 
    fullName: "", 
    department: "DCS",
    batchYear: "2024",
    startRollNo: "",
    endRollNo: ""
  });

  const [studentData, setStudentData] = useState({ 
    fullName: "", 
    studentId: "", 
    assignedCounselor: "" 
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role === "student") {
      fetch("/api/counselors")
        .then(res => res.json())
        .then(data => setCounselors(data));
    }
  }, [status, router, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = session?.user?.role === "student" ? studentData : counselorData;

    try {
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await update({ isProfileComplete: true }); 
        window.location.href = "/"; 
      } else {
        alert("Failed to complete profile.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading your profile...</div>;

  const role = session?.user?.role;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {role === "student" ? <GraduationCap className="w-8 h-8 text-white" /> : <Briefcase className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Complete Your Profile</h2>
          <p className="text-slate-400 mt-2 text-sm">Set up your university credentials to access the matrix.</p>
        </div>

        <div className="p-8">
          {role === "counselor" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="flex space-x-4">
                <div className="w-1/3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                  <select 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium bg-slate-50"
                    value={counselorData.title}
                    onChange={e => setCounselorData({...counselorData, title: e.target.value})}
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-slate-50 placeholder-slate-400"
                    value={counselorData.fullName}
                    onChange={e => setCounselorData({...counselorData, fullName: e.target.value})}
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              {/* NEW: Employee ID Field */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Employee ID</label>
                <input 
                  type="text" required
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono font-bold uppercase tracking-widest bg-slate-50 placeholder-slate-400"
                  value={counselorData.employeeId}
                  onChange={e => setCounselorData({...counselorData, employeeId: e.target.value.toUpperCase()})}
                  placeholder="e.g., EMP10234"
                />
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                  <select 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium bg-slate-50"
                    value={counselorData.department}
                    onChange={e => setCounselorData({...counselorData, department: e.target.value})}
                  >
                    <option value="DCS">DCS (Computer Science)</option>
                    <option value="DCE">DCE (Computer Engineering)</option>
                    <option value="DIT">DIT (Info Technology)</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Batch Year</label>
                  <select 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium bg-slate-50"
                    value={counselorData.batchYear}
                    onChange={e => setCounselorData({...counselorData, batchYear: e.target.value})}
                  >
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Roll No</label>
                  <input 
                    type="text" required
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono bg-slate-50 placeholder-slate-400"
                    value={counselorData.startRollNo}
                    onChange={e => setCounselorData({...counselorData, startRollNo: e.target.value})}
                    placeholder="e.g., 001"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Roll No</label>
                  <input 
                    type="text" required
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono bg-slate-50 placeholder-slate-400"
                    value={counselorData.endRollNo}
                    onChange={e => setCounselorData({...counselorData, endRollNo: e.target.value})}
                    placeholder="e.g., 060"
                  />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center group shadow-md">
                {isSubmitting ? "Saving Profile..." : "Enter Command Center"}
                {!isSubmitting && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}

          {role === "student" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Legal Name</label>
                <input 
                  type="text" required
                  className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-slate-50"
                  value={studentData.fullName}
                  onChange={e => setStudentData({...studentData, fullName: e.target.value})}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">College ID</label>
                <input 
                  type="text" required
                  className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono font-bold uppercase tracking-widest bg-slate-50 placeholder-slate-400"
                  value={studentData.studentId}
                  onChange={e => setStudentData({...studentData, studentId: e.target.value.toUpperCase()})}
                  placeholder="e.g., 24DCS088"
                />
                <p className="text-[11px] text-slate-400 mt-2 flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> Department is automatically extracted from your ID.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Counselor</label>
                <select 
                  required
                  className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium bg-slate-50"
                  value={studentData.assignedCounselor}
                  onChange={e => setStudentData({...studentData, assignedCounselor: e.target.value})}
                >
                  <option value="">-- Select Your Assigned Counselor --</option>
                  {counselors.map(c => (
                    <option key={c._id} value={c._id}>{c.fullName} ({c.department})</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-slate-900 text-white p-3.5 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center group shadow-md">
                {isSubmitting ? "Activating Profile..." : "Access Dashboard"}
                {!isSubmitting && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}