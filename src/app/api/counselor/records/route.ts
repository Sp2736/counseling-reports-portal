// src/app/api/counselor/records/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselorProfile } from "@/src/models/CounselorProfile";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { StudentProfile } from "@/src/models/StudentProfile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const counselor = await CounselorProfile.findOne({ userId: session.user.id });
    if (!counselor) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const records = await CounselingRecord.find({ assignedCounselor: counselor._id })
      .populate({
        path: 'student',
        model: StudentProfile,
        select: 'fullName studentId department'
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Dashboard Records Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}