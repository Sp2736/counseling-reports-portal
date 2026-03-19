// src/app/api/counselor/records/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { StudentProfile } from "@/src/models/StudentProfile";

// GET: Fetch the specific record for the counselor
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    const record = await CounselingRecord.findById(params.id)
      .populate({
        path: 'student',
        model: StudentProfile,
        select: 'fullName studentId department semester'
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

// PATCH: Save the counselor's final review
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
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
      params.id,
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
      { new: true }
    );

    return NextResponse.json({ message: "Review saved successfully!", record: updatedRecord }, { status: 200 });
  } catch (error) {
    console.error("Update Record Error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}