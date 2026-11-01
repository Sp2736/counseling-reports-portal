"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/src/lib/demo-context";
import {
  GraduationCap,
  Key,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  FileText,
  Bot
} from "lucide-react";
import { DUMMY_STUDENT } from "@/src/lib/demo-data";

export default function HomePage() {
  const router = useRouter();
  const {
    studentProfile,
    setStudentProfile,
    counselors,
    setRole,
    requestRoleSwitch,
  } = useDemo();

  const [formData, setFormData] = useState({
    fullName: studentProfile.fullName,
    studentId: studentProfile.studentId,
    department: studentProfile.department,
    assignedCounselor: studentProfile.assignedCounselor,
  });

  const [isDemoFilled, setIsDemoFilled] = useState(true);
  const [successToast, setSuccessToast] = useState(false);

  const handleFillDemoData = () => {
    setFormData({
      fullName: DUMMY_STUDENT.fullName,
      studentId: DUMMY_STUDENT.studentId,
      department: DUMMY_STUDENT.department,
      assignedCounselor: DUMMY_STUDENT.assignedCounselor,
    });
    setIsDemoFilled(true);
  };

  const handleClearData = () => {
    setFormData({
      fullName: "",
      studentId: "",
      department: "DCS - Computer Science & Engineering",
      assignedCounselor: counselors[0]?._id || "",
    });
    setIsDemoFilled(false);
  };

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.studentId.trim()) {
      alert("Please enter the student's legal name and ID.");
      return;
    }

    const assignedCounselorObj = counselors.find(
      (c) => c._id === formData.assignedCounselor
    );

    setStudentProfile((prev) => ({
      ...prev,
      fullName: formData.fullName,
      studentId: formData.studentId.toUpperCase(),
      department: formData.department,
      assignedCounselor: formData.assignedCounselor,
      assignedCounselorName: assignedCounselorObj?.fullName || "Assigned Counselor",
    }));

    setRole("student");
    setSuccessToast(true);

    setTimeout(() => {
      router.push("/student/dashboard");
    }, 400);
  };

  const handleDirectCounselor = () => {
    setRole("counselor");
    router.push("/counselor/waiting-list");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Top University Branding Bar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                DEVANG PATEL INSTITUTE OF ADVANCE TECHNOLOGY AND RESEARCH (DEPSTAR)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Live Interactive Demo
            </span>
            <button
              onClick={handleDirectCounselor}
              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Faculty Portal →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Driven Academic Support Matrix</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Student Counseling & SWOT Analysis Portal
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An automated diagnostic platform uniting student self-reflection, privacy-preserving AI insights, and counselor interventions into standardized academic records.
          </p>
        </div>

        {/* BYOK Architecture Brief Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-300 backdrop-blur-sm">
                <Key className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Bring Your Own Key (BYOK) Architecture
                </h3>
                <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                  Decentralized, privacy-first AI processing for student sensitive disclosures
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              In production, this platform implements a strict <strong>Bring Your Own Key (BYOK)</strong> paradigm. Instead of channeling students' personal weaknesses, anxieties, and family hurdles through a centralized third-party subscription or shared server credentials:
            </p>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  1. Zero Credential Exposure
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Academic counseling notes and personal disclosures are processed with zero persistent central server retention. Counselors supply their own Google Gemini API key.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  2. Autonomous Rate Limits
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Heavy semester-end batch runs and automated background cron triggers execute against the university's dedicated API quotas, preventing multi-tenant slowdowns.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  3. Student Data Sovereignty
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct API calls to Google Gemini guarantee enterprise non-training terms, ensuring sensitive student reflections are never utilized to train foundation models.
                </p>
              </div>
            </div>

            {/* Simulated pipeline note for demo */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3.5">
              <Bot className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                <strong>How This Public Demo Operates:</strong> Since visitors cannot and should not enter their personal Google Cloud API credentials into an online demo, this demo version features a <strong>Simulated AI Processing Pipeline</strong>. When you submit SWOT analyses, the system processes them with authentic structured outputs (Risk Scores, Key Vulnerability Flags, and Action Interventions) mirroring live production outputs.
              </div>
            </div>
          </div>
        </section>

        {/* Student Onboarding / Input Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Student Role Entry</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Setup Student Profile & Credentials
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Configure your student profile or use one-click demo data to begin exploring.
              </p>
            </div>

            {/* Toggle / Fill buttons */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleFillDemoData}
                className="flex-1 sm:flex-none cursor-pointer inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Fill Demo Student</span>
              </button>
              <button
                type="button"
                onClick={handleClearData}
                className="cursor-pointer inline-flex items-center justify-center p-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition"
                title="Clear inputs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitStudent} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Full Legal Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g., Arjun Mehta"
                  className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm sm:text-base"
                />
              </div>

              {/* College ID */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  College ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                  placeholder="e.g., 24DCS088"
                  className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-mono font-bold tracking-wider placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm sm:text-base"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 mr-1 shrink-0" />
                  Format: 24DCS088 (Batch: 2024, Dept: DCS, Roll: 088)
                </p>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Academic Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm sm:text-base cursor-pointer"
                >
                  <option value="DCS - Computer Science & Engineering">DCS - Computer Science & Engineering</option>
                  <option value="DCE - Computer Engineering">DCE - Computer Engineering</option>
                  <option value="DIT - Information Technology">DIT - Information Technology</option>
                </select>
              </div>

              {/* Assigned Counselor */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Assigned Faculty Counselor
                </label>
                <select
                  value={formData.assignedCounselor}
                  onChange={(e) => setFormData({ ...formData, assignedCounselor: e.target.value })}
                  className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm sm:text-base cursor-pointer"
                >
                  {counselors.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} ({c.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Launch Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ready to submit new SWOT analyses and review completed records.</span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/25 group text-sm sm:text-base"
                >
                  <span>Launch Student Portal</span>
                  <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Both Roles Quick Access Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Role Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Student Features</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Submit comprehensive SWOT analysis forms with pre-filled dummy reflections. Track the simulated AI diagnostic queue, view cancel status, or print official formatted documents.
              </p>
            </div>
            <button
              onClick={() => {
                setRole("student");
                router.push("/student/dashboard");
              }}
              className="cursor-pointer inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-800 font-bold rounded-xl text-sm transition"
            >
              <span>Open Student Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          {/* Counselor Role Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Faculty & Counselor Features</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review submitted student reports in real time, examine AI-calculated Risk Levels (Low, Medium, High), trigger AI auto-fill for action plans, or run Batch Approvals across the entire roster.
              </p>
            </div>
            <button
              onClick={handleDirectCounselor}
              className="cursor-pointer inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition shadow-sm"
            >
              <span>Open Counselor Command</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
