// src/app/api/counselor/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselorProfile } from "@/src/models/CounselorProfile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    const profile = await CounselorProfile.findOne({ userId: session.user.id }).lean();
    
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Fetch Counselor Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { fullName, department, expertise } = await req.json();

    if (!fullName || !department) {
      return NextResponse.json({ error: "Name and Department are required" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedProfile = await CounselorProfile.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { fullName, department, expertise } },
      { new: true }
    );

    return NextResponse.json({ message: "Profile updated successfully!", profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Update Counselor Profile Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}