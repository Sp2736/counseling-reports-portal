// src/app/api/counselor/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselorProfile } from "@/src/models/CounselorProfile";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselingRecord } from "@/src/models/CounselingRecord";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const counselor = await CounselorProfile.findOne({ userId: session.user.id });
    if (!counselor) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // 1. Get total students assigned to this counselor
    const totalStudents = await StudentProfile.countDocuments({ assignedCounselor: counselor._id });

    // 2. Get all records for period-wise calculation
    const records = await CounselingRecord.find({ assignedCounselor: counselor._id }, "report_period").lean();
    
    const periodStats = {
      period1: records.filter(r => (r.report_period || 1) === 1).length,
      period2: records.filter(r => r.report_period === 2).length,
      period3: records.filter(r => r.report_period === 3).length,
      period4: records.filter(r => r.report_period === 4).length,
    };

    return NextResponse.json({ totalStudents, totalSubmitted: records.length, periodStats }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}