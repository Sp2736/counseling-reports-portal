// src/app/api/counselor/students/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // SAFETY CHECK: Prevents the "Cast to ObjectId failed" 500 server crash
    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid student identifier format." }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    // 1. Get the student's basic info
    const student = await StudentProfile.findById(id).lean();
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // 2. Get all their past counseling records that have been reviewed, newest first
    const records = await CounselingRecord.find({ student: id, status: "Reviewed_Completed" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ student, records }, { status: 200 });

  } catch (error) {
    console.error("Fetch Student History Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}