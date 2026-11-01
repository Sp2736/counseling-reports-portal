"use client";

import Link from "next/link";
import { Users, GraduationCap, Briefcase, FileText, ArrowLeft, Shield } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";

export default function AdminDashboardPage() {
  const { studentsRoster, counselors, records } = useDemo();

  const totalStudents = studentsRoster.length;
  const totalCounselors = counselors.length;
  const totalUsers = totalStudents + totalCounselors + 1; // + admin
  const pendingAIReports = records.filter((r) => r.status === "Pending_AI").length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>System Administrator Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Platform Administration Matrix
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              System overview, institutional metrics, and user management.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
            >
              + Provision User
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold rounded-xl text-sm transition"
            >
              ← Back to Portal Home
            </Link>
          </div>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Users</p>
              <h3 className="text-2xl font-black text-gray-900">{totalUsers}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</p>
              <h3 className="text-2xl font-black text-gray-900">{totalStudents}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Counselors</p>
              <h3 className="text-2xl font-black text-gray-900">{totalCounselors}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Queue</p>
              <h3 className="text-2xl font-black text-gray-900">{pendingAIReports}</h3>
            </div>
          </div>
        </div>

        {/* Quick Role Jump in Admin */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Quick Portal Views (Demo)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/student/dashboard"
              className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 flex items-center justify-between font-bold text-indigo-900 text-sm transition"
            >
              <span>View as Student (Arjun Mehta)</span>
              <span>→</span>
            </Link>
            <Link
              href="/counselor/waiting-list"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-800 text-sm transition"
            >
              <span>View as Faculty (Dr. Priya Sharma)</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
