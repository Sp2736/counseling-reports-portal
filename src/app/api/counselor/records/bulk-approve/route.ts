// src/app/api/counselor/records/bulk-approve/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { recordIds } = await req.json();
    if (!Array.isArray(recordIds) || recordIds.length === 0) {
      return NextResponse.json({ error: "No records provided" }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch records to copy ai_analysis fields to counselor_review
    const recordsToUpdate = await CounselingRecord.find({ _id: { $in: recordIds }, status: "Needs_Review" });

    const updatePromises = recordsToUpdate.map(record => {
      record.status = "Reviewed_Completed";
      record.counselor_review = {
        final_risk_level: record.ai_analysis?.risk_prediction?.risk_level || "Medium",
        final_action_plan: record.ai_analysis?.generated_report?.recommended_action_plan || "Continue monitoring.",
        reviewed_at: new Date()
      };
      return record.save();
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Records approved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Bulk Approve Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}