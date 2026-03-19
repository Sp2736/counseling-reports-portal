// src/app/api/counselors/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselorProfile } from "@/src/models/CounselorProfile";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch only the ID and Full Name to keep the payload lightweight
    const counselors = await CounselorProfile.find({}, "_id fullName").lean();
    return NextResponse.json(counselors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch counselors" }, { status: 500 });
  }
}