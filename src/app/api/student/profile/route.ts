// src/app/api/student/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselorProfile } from "@/src/models/CounselorProfile";

// GET: Fetch the current profile data
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    const profile = await StudentProfile.findOne({ userId: session.user.id }).lean();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Also fetch the list of counselors so they can populate the dropdown
    const counselors = await CounselorProfile.find({}, "_id fullName").lean();

    return NextResponse.json({ profile, counselors }, { status: 200 });
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update the profile data
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { fullName, department, assignedCounselor } = await req.json();

    if (!fullName || !department || !assignedCounselor) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { fullName, department, assignedCounselor } },
      { new: true }
    );

    return NextResponse.json({ message: "Profile updated successfully!", profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}