// src/app/admin/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { Users, GraduationCap, Briefcase, FileText } from "lucide-react";

export default async function AdminDashboardPage() {
  // 1. Double-check security on the server side
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  // 2. Connect to the database
  await connectToDatabase();

  // 3. Fetch our metrics concurrently for speed
  const [
    totalStudents,
    totalCounselors,
    totalUsers,
    pendingAIReports
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "counselor" }),
    User.countDocuments(),
    CounselingRecord.countDocuments({ status: "Pending_AI" })
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-600 mt-1">
            System overview and platform metrics.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Total Users */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
            </div>
          </div>

          {/* Card 2: Students */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Registered Students</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalStudents}</h3>
            </div>
          </div>

          {/* Card 3: Counselors */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Counselors</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalCounselors}</h3>
            </div>
          </div>

          {/* Card 4: Pending Reports */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending AI Reports</p>
              <h3 className="text-2xl font-bold text-gray-900">{pendingAIReports}</h3>
            </div>
          </div>

        </div>

        {/* Quick Actions Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
              Manage Users
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
              Configure AI Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}