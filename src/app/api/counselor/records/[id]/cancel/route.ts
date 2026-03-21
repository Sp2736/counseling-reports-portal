// src/app/api/counselor/records/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // FIX: Unwrap Next.js 15 params
    const resolvedParams = await params;
    const recordId = resolvedParams.id;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { cancellation_reason } = await req.json();
    await connectToDatabase();

    // Save the reason into the counselor_review so the student can fetch it
    const record = await CounselingRecord.findByIdAndUpdate(
      recordId,
      { 
        $set: { 
          status: "Cancelled_By_Counselor",
          counselor_review: {
            final_risk_level: "N/A",
            final_action_plan: `Reason for Rejection:\n${cancellation_reason || "No specific reason provided."}`,
            reviewed_at: new Date()
          }
        } 
      },
      { returnDocument: 'after' }
    );

    if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
    return NextResponse.json({ message: "Rejected successfully" }, { status: 200 });
  } catch (error) {
    console.error("Counselor Cancel Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}