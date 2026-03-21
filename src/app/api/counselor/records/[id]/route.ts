// src/app/api/counselor/records/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselorProfile } from "@/src/models/CounselorProfile"; // Added Counselor Profile Model

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const recordId = resolvedParams.id;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    const record = await CounselingRecord.findById(recordId)
      .populate({
        path: 'student',
        model: StudentProfile,
        select: 'fullName studentId department semester'
      })
      // NEW: Fetch the Counselor's Profile so we can use their name in the signature block
      .populate({
        path: 'assignedCounselor',
        model: CounselorProfile,
        select: 'fullName'
      })
      .lean();

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Fetch Record Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const recordId = resolvedParams.id;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { final_risk_level, final_action_plan } = await req.json();

    if (!final_risk_level || !final_action_plan) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedRecord = await CounselingRecord.findByIdAndUpdate(
      recordId,
      {
        $set: {
          status: "Reviewed_Completed",
          counselor_review: {
            final_risk_level,
            final_action_plan,
            reviewed_at: new Date()
          }
        }
      },
      { returnDocument: 'after' } 
    );

    return NextResponse.json({ message: "Review saved successfully!", record: updatedRecord }, { status: 200 });
  } catch (error) {
    console.error("Update Record Error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}