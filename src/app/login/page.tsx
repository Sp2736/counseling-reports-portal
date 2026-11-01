"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { University, GraduationCap, Users, ArrowRight } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useDemo();

  const handleEnterStudent = () => {
    setRole("student");
    router.push("/student/dashboard");
  };

  const handleEnterCounselor = () => {
    setRole("counselor");
    router.push("/counselor/waiting-list");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <University className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Interactive Demo Portal</h2>
          <p className="text-slate-400 mt-2 text-sm">Select a role to enter the university system.</p>
        </div>

        <div className="p-8 space-y-4">
          <button
            onClick={handleEnterStudent}
            className="w-full p-4 rounded-2xl border-2 border-indigo-100 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 flex items-center justify-between text-left transition group cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Student Role</p>
                <p className="text-xs text-slate-500">Submit SWOT forms & view growth reports</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleEnterCounselor}
            className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-800 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition group cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Faculty Counselor</p>
                <p className="text-xs text-slate-500">Action Queue, AI Diagnostics & Approvals</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-800 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-4 text-center">
            <Link href="/" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              ← Return to Welcome & BYOK Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
