// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { University, ChevronRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  // Added secretKey to our form state
  const [formData, setFormData] = useState({ email: "", password: "", role: "student", secretKey: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register");

      const signInRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInRes?.error) throw new Error(signInRes.error);
      
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <University className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 mt-2 text-sm">Join the University Counseling Matrix.</p>
        </div>

        <div className="p-8">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Type</label>
              <select 
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium bg-slate-50"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value, secretKey: ""})} // Resets key if they toggle back to student
              >
                <option value="student">I am a Student</option>
                <option value="counselor">I am a Counselor</option>
              </select>
            </div>

            {/* NEW: Conditional Counselor Authorization Field */}
            {formData.role === "counselor" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Counselor Authorization Key</label>
                <input 
                  type="password" required
                  className="w-full p-3.5 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-indigo-50/30 placeholder-slate-400"
                  value={formData.secretKey}
                  onChange={e => setFormData({...formData, secretKey: e.target.value})}
                  placeholder="Enter the staff passcode"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">University Email</label>
              <input 
                type="email" required
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-slate-50 placeholder-slate-400"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="you@university.edu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" required minLength={6}
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-slate-50 placeholder-slate-400"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-2 bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center group shadow-md">
              {isLoading ? "Creating Account..." : "Sign Up"}
              {!isLoading && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-bold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 