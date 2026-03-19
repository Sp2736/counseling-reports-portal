// src/app/api/student/records/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// Reminder: Use relative paths like ../../../../lib/mongodb if the @/ alias acts up
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselingRecord } from "@/src/models/CounselingRecord";

export async function GET(req: Request) {
  try {
    // 1. Security Check: Must be logged in as a student
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    // 2. Find the specific student profile
    const studentProfile = await StudentProfile.findOne({ userId: session.user.id });
    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // 3. Fetch all their records, sorted from newest to oldest
    const records = await CounselingRecord.find({ student: studentProfile._id })
      .sort({ createdAt: -1 }) // -1 means descending (newest first)
      .lean();

    return NextResponse.json(records, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch student records:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}