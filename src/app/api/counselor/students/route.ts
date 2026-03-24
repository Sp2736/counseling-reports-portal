// src/app/api/counselor/students/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselorProfile } from "@/src/models/CounselorProfile";
import { StudentProfile } from "@/src/models/StudentProfile";
import { User } from "@/src/models/User"; 
import { CounselingRecord } from "@/src/models/CounselingRecord";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    const counselor = await CounselorProfile.findOne({ userId: session.user.id });
    if (!counselor) return NextResponse.json({ error: "Counselor profile not found" }, { status: 404 });

    // 1. Fetch the raw students
    const studentsRaw = await StudentProfile.find({ assignedCounselor: counselor._id }).lean();
    
    // 2. Fetch their associated emails manually
    const userIds = studentsRaw.map(s => s.userId).filter(Boolean);
    const users = await User.find({ _id: { $in: userIds } }).select("email").lean();

    // 3. NEW: Fetch Counseling Records for these students to calculate status and risk
    const studentIds = studentsRaw.map(s => s._id);
    const allRecords = await CounselingRecord.find({ student: { $in: studentIds } })
        .select("student status counselor_review.final_risk_level createdAt")
        .sort({ createdAt: -1 }) // Newest first
        .lean();

    // 4. Map the data cleanly for the frontend table
    const students = studentsRaw.map((student: any) => {
      const matchedUser = users.find((u: any) => u._id.toString() === student.userId?.toString());
      
      // Filter records belonging only to this specific student
      const studentRecords = allRecords.filter((r: any) => r.student?.toString() === student._id.toString());
      
      const pendingCount = studentRecords.filter((r: any) => r.status === "Needs_Review").length;
      const completedCount = studentRecords.filter((r: any) => r.status === "Reviewed_Completed").length;
      
      // Since we sorted by createdAt: -1, the first "Reviewed_Completed" is their most recent risk score
      const latestCompleted = studentRecords.find((r: any) => r.status === "Reviewed_Completed");
      const latestRiskLevel = latestCompleted?.counselor_review?.final_risk_level || "N/A";

      return {
        _id: student._id?.toString() || "",
        fullName: student.fullName || "Unknown",
        studentId: student.studentId || "Unknown",
        department: student.department || "Unknown",
        email: matchedUser?.email || "No email linked",
        pendingCount,
        completedCount,
        latestRiskLevel
      };
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Roster Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load directory" }, { status: 500 });
  }
}