// src/app/admin/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { Users, GraduationCap, Briefcase, FileText } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  await connectToDatabase();

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            System overview and platform metrics.
          </p>
        </div>

        {/* Stack single column on mobile, 2 on tablets, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalUsers}</h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Students</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalStudents}</h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Counselors</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalCounselors}</h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">System Queue (AI)</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{pendingAIReports}</h3>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}