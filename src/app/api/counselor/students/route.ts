// src/app/api/counselor/students/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselorProfile } from "@/src/models/CounselorProfile";
import { StudentProfile } from "@/src/models/StudentProfile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    // Find the counselor's profile ID
    const counselor = await CounselorProfile.findOne({ userId: session.user.id });
    if (!counselor) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Find all students assigned to this counselor
    const students = await StudentProfile.find({ assignedCounselor: counselor._id })
      .select("fullName studentId department")
      .lean();

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Fetch Roster Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}