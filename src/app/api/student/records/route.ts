// src/app/api/student/records/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselorProfile } from "@/src/models/CounselorProfile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    
    // Find the specific Student Profile ID using their login ID
    const studentProfile = await StudentProfile.findOne({ userId: session.user.id });
    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Fetch records and populate BOTH the student and the counselor
    const records = await CounselingRecord.find({ student: studentProfile._id })
      .populate({
        path: 'student',
        model: StudentProfile,
        select: 'fullName studentId department'
      })
      .populate({
        path: 'assignedCounselor',
        model: CounselorProfile,
        select: 'fullName'
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Fetch Student Records Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}