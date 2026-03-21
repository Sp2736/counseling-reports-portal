// src/app/api/student/records/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { StudentProfile } from "@/src/models/StudentProfile";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const recordId = resolvedParams.id;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    
    // THE FIX: We must find the specific Student Profile ID first
    const studentProfile = await StudentProfile.findOne({ userId: session.user.id });
    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }
    
    // Now we cancel the report using the correct studentProfile._id reference
    const record = await CounselingRecord.findOneAndUpdate(
      { _id: recordId, student: studentProfile._id },
      { $set: { status: "Cancelled_By_Student" } },
      { returnDocument: 'after' }
    );

    if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
    return NextResponse.json({ message: "Cancelled successfully" }, { status: 200 });
  } catch (error) {
    console.error("Student Cancel Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}