// src/app/api/counselor/records/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { cancellation_reason } = await req.json();

    if (!cancellation_reason || cancellation_reason.trim() === "") {
      return NextResponse.json({ error: "Cancellation reason is required." }, { status: 400 });
    }

    await connectToDatabase();

    const record = await CounselingRecord.findByIdAndUpdate(
      id,
      { 
        status: "Cancelled_By_Counselor",
        cancellation_reason: cancellation_reason 
      },
      { new: true }
    );

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report cancelled successfully." }, { status: 200 });

  } catch (error) {
    console.error("Counselor Cancel Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}