"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { University, ChevronRight, GraduationCap, Users } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";

export default function SignupPage() {
  const router = useRouter();
  const { setRole } = useDemo();
  const [roleChoice, setRoleChoice] = useState<"student" | "counselor">("student");

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(roleChoice);
    if (roleChoice === "student") {
      router.push("/student/dashboard");
    } else {
      router.push("/counselor/waiting-list");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <University className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Interactive Demo Sign Up</h2>
          <p className="text-slate-400 mt-2 text-sm">Experience the university platform immediately.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLaunch} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Portal Access Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoleChoice("student")}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                    roleChoice === "student"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <GraduationCap className="w-6 h-6 mb-1 text-indigo-600" />
                  <span className="text-xs">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleChoice("counselor")}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                    roleChoice === "counselor"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <Users className="w-6 h-6 mb-1 text-indigo-600" />
                  <span className="text-xs">Counselor</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                University Email (Demo)
              </label>
              <input
                type="email"
                defaultValue={roleChoice === "student" ? "arjun.mehta@demo-univ.edu" : "priya.sharma@demo-univ.edu"}
                className="w-full p-3.5 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 cursor-pointer bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center group shadow-md"
            >
              <span>Launch Demo Portal</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            Prefer direct home? <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-bold">BYOK Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
