// src/app/api/student/records/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";

// FIX: Declare params as a Promise
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // FIX: Await the params to safely extract the ID
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    const record = await CounselingRecord.findById(id);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (record.status === "Reviewed_Completed") {
      return NextResponse.json({ error: "Cannot cancel a report that is already reviewed." }, { status: 400 });
    }

    record.status = "Cancelled_By_Student";
    await record.save();

    return NextResponse.json({ message: "Report cancelled successfully." }, { status: 200 });

  } catch (error) {
    console.error("Cancellation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}